import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    GuildMember,
    Interaction,
    Message,
    MessageFlags,
    PartialMessage,
    Partials,
    PollAnswer,
    REST,
    Routes,
    VoiceState
} from "discord.js";
import dotenv from "dotenv";
import { getMongo } from "@/lib/mongo";
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { Actions, initActions } from "./DatabaseActions/Actions";
import startBatchSendModerationLogs from "./Cron/ModerationLogSend";
import path from "node:path";
import { fetchE6Media, scheduleFetchE6Media } from "./Cron/FetchE6Media";

// Configure dotenv
dotenv.config();

// Configure mongo
const mongo = getMongo();

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessagePolls
    ],
    partials: [
        Partials.Message,
        Partials.Channel
    ]
}) as Client & { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    commands: Collection<string, any>;
};

const rest = new REST().setToken(process.env.MARBLE_FOXXO_SECRET!);

// Register slash commands
(async () => {
    client.commands = new Collection();

    const foldersPath = path.join(__dirname, "Discord", "Commands");
    const commandFolders = readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const commandModule = await import(pathToFileURL(filePath).href);
            const command = commandModule.default ?? commandModule;

            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.warn(`[${new Date().toISOString()}] [Command Register] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    try {
        console.info(`[${new Date().toISOString()}] [Slash Commands] Refreshing application commands.`);

        await rest.put(
            Routes.applicationCommands(process.env.MARBLE_FOXXO_CLIENT!),
            { body: client.commands.map(cmd => cmd.data.toJSON()) }
        );

        console.info(`[${new Date().toISOString()}] [Slash Commands] Successfully refreshed application commands.`);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error(`[${new Date().toISOString()}] [Slash Commands] Error refreshing appliation commands:`, error);
    }
})();

/* ------------------------------------------------------------ Listeners ------------------------------------------------------------ */
client.once(Events.ClientReady, async readyClient => {
    // Log ready status
    console.info(`[${new Date().toISOString()}] Logged in as ${readyClient.user.tag}!`);

    // Init database actions object
    await initActions();

    // Add any guilds to database that aren't already there
    // This technically should never happen, but just in case
    for (const [, guild] of client.guilds.cache) {
        await Actions.addGuild(guild);
    }

    // Start moderation cron job
    await startBatchSendModerationLogs(client);

    // Fetch e6 media initially and then schedule it
    await fetchE6Media();
    scheduleFetchE6Media();
});

client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    // Add guild member to database
    await Actions.addGuildMember(member);
});

client.on(Events.MessagePollVoteAdd, async (pollAnswer: PollAnswer, userId: string) => {
    const guild = pollAnswer.poll.message.guild;

    if (!guild) return;

    const member = await guild.members.fetch(userId).catch(() => null);

    if (!member) return;

    // Increment poll votes cast
    await Actions.incrementPollVotesCast(guild, member);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;

    // Cache
    await Actions.cacheMessage(message);

    // Increment message count for member
    await Actions.incrementMessageCount(message);

    // Increment guild total message count
    await Actions.incrementTotalMessages(message.guild);

    // Increment attachments count if necessary
    if (message.attachments.size > 0) await Actions.incrementAttachmentsShared(message);
});

client.on(Events.MessageDelete, async (message: Message | PartialMessage) => {
    if (message.author?.bot) return;
});

client.on(Events.MessageUpdate, async (oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage) => {
    // Cache edited message
    await Actions.cacheEditedMessage(oldMsg, newMsg as Message);

    // Increment edited messages
    await Actions.incrementEditedMessages(newMsg as Message);

    // Old message isn't cached
    if (oldMsg.partial) {}

    // New message isn't cached
    if (newMsg.partial) {}

    // Both are cached
    if (!oldMsg.partial && !newMsg.partial) {}
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`[${new Date().toISOString()}] [Guild Interaction Error] No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        console.info(`[${new Date().toISOString()}] [Guild Interaction] Valid Interaction Created - ${interaction.channelId}`);

        await command.execute(interaction);
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error(`[${new Date().toISOString()}] [Guild Interaction Error] Error executing ${interaction.commandName}:`, error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.on(Events.GuildCreate, async guild => {
    console.info(`[${new Date().toISOString()}] [Guild Added] ${guild.id} | ${guild.name}`);

    // Add guild
    await Actions.addGuild(guild);
});

client.on(Events.GuildDelete, async guild => {
    console.info(`[${new Date().toISOString()}] [Guild Removed] ${guild.id} | ${guild.name}`);

    // Remove guild
    Actions.removeGuild(guild);
});

client.on(Events.VoiceStateUpdate, async (oldState: VoiceState, newState: VoiceState) => {
    // User joins voice channel
    if (!oldState.channelId && newState.channelId) await Actions.setJoinedVCTimestamp(newState.member);

    // User leaves voice channel
    if (oldState.channelId && !newState.channelId) await Actions.setLeftVCTimestamp(oldState.member);

    // User switches channels
    if (oldState.channel && newState.channelId && oldState.channelId !== newState.channelId) {
        // Nothing planned here yet
    }

    // User started streaming
    if (!oldState.streaming && newState.streaming) {
        const guild = newState.guild;
        const member = newState.member;

        if (!member) return;

        await Actions.incrementStreamingSessionsStarted(guild, member);
    }

    // User stopped streaming
    if (oldState.streaming && !newState.streaming) {
        // Nothing planned here yet
    }
});

process.on("SIGINT", async () => {
    // Shut down server
    console.warn(`[${new Date().toISOString()}] [SIGINT] Shutting down server...`);

    // Close mongo pool connection
    await mongo.ClosePoolConnection();

    // Finally exits
    process.exit(0);
});

client.on(Events.Error, (error: Error) => {
    if ((error as NodeJS.ErrnoException).code) {
        const err = error as NodeJS.ErrnoException;
        
        if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "ENOTFOUND") console.error(`[${new Date().toISOString()}] [Discord Client Error] [Network Error] Could not reach Discord:`, error);
        
        return;
    }

    console.error(`[${new Date().toISOString()}] [Discord Client Error]`, error);
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(client.ws as any).on(Events.Error, (error: Error) => {
    console.error(`[${new Date().toISOString()}] [Discord Gateway Error]`, error);
});

client.on(Events.ShardError, (error, shardId) => {
  console.error(`[${new Date().toISOString()}] [Shard ${shardId} Error] ${error.message}`);
});

// Login
client.login(process.env.MARBLE_FOXXO_SECRET).catch((error: Error) => {
    if (error.message.includes("TOKEN_INVALID")) {
        console.error(`[${new Date().toISOString()}] [Bot Login Error] Invalid bot token`);
        return;
    }

    console.error(`[${new Date().toISOString()}] [Bot Login Error]`, error);
});