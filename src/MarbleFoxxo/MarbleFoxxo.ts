import {
    AttachmentBuilder,
    AuditLogEvent,
    Client,
    Collection,
    Colors,
    Events,
    GatewayIntentBits,
    Guild,
    GuildMember,
    Interaction,
    Message,
    MessageFlags,
    PartialGuildMember,
    PartialMessage,
    Partials,
    PollAnswer,
    PrivateThreadChannel,
    PublicThreadChannel,
    REST,
    Routes,
    VoiceState
} from "discord.js";
import dotenv from "dotenv";
import { getMongo } from "@/lib/mongo";
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import startBatchSendModerationLogs from "./Cron/ModerationLogSend";
import path from "node:path";
import { fetchE6Media, scheduleFetchE6Media } from "./Cron/FetchE6Media";
import MessageLeveling from "./lib/handlers/MessageLeveling";
import MemberJoinLeave from "./lib/handlers/MemberJoinLeave";
import MediaEmbed from "./Discord/EmbedWrappers/MediaEmbed";
import { addGuild } from "@/lib/database/Guilds/addGuild";
import { addGuildMember } from "@/lib/database/Members/addGuildMember";
import { incrementPollVotesCast } from "@/lib/database/Members/incrementPollVotesCast";
import { cacheMessage } from "@/lib/database/Messages/cacheMessage";
import { incrementMessageCount } from "@/lib/database/Members/incrementMessageCount";
import { incrementTotalMessages } from "@/lib/database/Guilds/incrementTotalMessages";
import { incrementAttachmentsShared } from "@/lib/database/Members/incrementAttachmentsShared";
import { cacheDeletedMessage } from "@/lib/database/Messages/cacheDeletedMessage";
import { cacheEditedMessage } from "@/lib/database/Messages/cacheEditedMessage";
import { incrementEditedMessages } from "@/lib/database/Members/incrementEditedMessages";
import { removeGuild } from "@/lib/database/Guilds/removeGuild";
import { setJoinedVCTimestamp } from "@/lib/database/Members/setJoinedVCTimestamp";
import { setLeftVCTimestamp } from "@/lib/database/Members/setLeftVCTimestamp";
import { incrementStreamingSessionsStarted } from "@/lib/database/Members/incrementStreamingSessionsStarted";

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

const rest = new REST().setToken(process.env.MARBLE_FOXXO_TOKEN!);

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

    // Add any guilds to database that aren't already there
    // This technically should never happen, but just in case
    for (const [, guild] of client.guilds.cache) {
        await addGuild(guild);
    }

    // Start moderation cron job
    startBatchSendModerationLogs(client);

    // Fetch e6 media initially and then schedule it
    fetchE6Media();
    scheduleFetchE6Media();
});

client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    // Add guild member to database
    await addGuildMember(member);
});

client.on(Events.MessagePollVoteAdd, async (pollAnswer: PollAnswer, userId: string) => {
    const guild = pollAnswer.poll.message.guild;

    if (!guild) return;

    const member = await guild.members.fetch(userId).catch(() => null);

    if (!member) return;

    // Increment poll votes cast
    await incrementPollVotesCast(guild, member);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;

    // Cache
    await cacheMessage(message);

    // Increment message count for member
    await incrementMessageCount(message);

    // Increment guild total message count
    await incrementTotalMessages(message.guild as Guild);

    // Increment attachments count if necessary
    if (message.attachments.size > 0) await incrementAttachmentsShared(message);

    // DO LAST: Handle leveling up
    await MessageLeveling(message);
});

client.on(Events.MessageDelete, async (message: Message | PartialMessage) => {
    if (message.author?.bot) return;

    // Cache deleted message
    await cacheDeletedMessage(message);
});

client.on(Events.MessageUpdate, async (oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage) => {
    if (oldMsg.author?.bot || newMsg.author?.bot) return;

    // Cache edited message
    await cacheEditedMessage(oldMsg, newMsg as Message);

    // Increment edited messages
    await incrementEditedMessages(newMsg as Message);

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
    await addGuild(guild);

    // Send welcome/setup message
    let inviteUser = null;
    try {
        // Attempt to find inviting user
        const auditLogs = await guild.fetchAuditLogs({
            type: AuditLogEvent.BotAdd,
            limit: 1
        });

        const entry = auditLogs.entries.find((e) => e.target?.id === client.user?.id);
        inviteUser = entry?.executor ?? null;

        if (!inviteUser) {
            throw new Error("Could not find a valid bot invite in the audit logs to send welcome message!");
        }

        // Send welcome embed
        const iconFile = new AttachmentBuilder(path.join(__dirname, "the_marble_grove.png"), { name: "the_marble_grove.png" });
        const embed = await MediaEmbed(
            `Thank you for choosing Marble Foxxo!`,
            `Thank you for choosing Marble Foxxo for your server!\n\nPlease link your Discord account to access your management interface: https://discord.com/oauth2/authorize?client_id=1390546028226412544&response_type=code&redirect_uri=https%3A%2F%2Fmarblefoxxo.wildwhispers.xyz%2Fapi%2Fauth%2Fcallback&scope=identify+guilds+email\n\nNeed help? Join our Discord server! https://discord.gg/FabRvm7AF4`,
            Colors.Gold,
            `attachment://the_marble_grove.png`
        );
        await inviteUser.send({ embeds: [embed], files: [iconFile] });

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error(`[${new Date().toISOString()}] [Guild Error] Could not send welcome message on guild add for guild ${guild.id}:`, error);
    }
});

client.on(Events.GuildDelete, async guild => {
    console.info(`[${new Date().toISOString()}] [Guild Removed] ${guild.id} | ${guild.name}`);

    // Remove guild
    removeGuild(guild);
});

client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    await MemberJoinLeave(member, true);
});

client.on(Events.GuildMemberRemove, async (member: GuildMember | PartialGuildMember) => {
    await MemberJoinLeave(member, false);
});

client.on(Events.VoiceStateUpdate, async (oldState: VoiceState, newState: VoiceState) => {
    // User joins voice channel
    if (!oldState.channelId && newState.channelId) await setJoinedVCTimestamp(newState.member as GuildMember);

    // User leaves voice channel
    if (oldState.channelId && !newState.channelId) await setLeftVCTimestamp(oldState.member as GuildMember);

    // User switches channels
    if (oldState.channel && newState.channelId && oldState.channelId !== newState.channelId) {
        // Nothing planned here yet
    }

    // User started streaming
    if (!oldState.streaming && newState.streaming) {
        const guild = newState.guild;
        const member = newState.member;

        if (!member) return;

        await incrementStreamingSessionsStarted(guild, member);
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
client.login(process.env.MARBLE_FOXXO_TOKEN).catch((error: Error) => {
    if (error.message.includes("TOKEN_INVALID")) {
        console.error(`[${new Date().toISOString()}] [Bot Login Error] Invalid bot token`);
        return;
    }

    console.error(`[${new Date().toISOString()}] [Bot Login Error]`, error);
});

export function listenToThread(thread: PrivateThreadChannel | PublicThreadChannel<false>, callback: (msg: Message) => void) {
    const handler = (msg: Message) => {
        if (msg.channel.id === thread.id) callback(msg);
    };

    // Attach listener
    client.on(Events.MessageCreate, handler);

    return () => client.off(Events.MessageCreate, handler);
}