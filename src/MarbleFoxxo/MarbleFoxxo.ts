import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Guild,
    Interaction,
    MessageFlags,
    REST,
    Routes
} from "discord.js";
import dotenv from "dotenv";
import { getMongo } from "@/lib/mongo";
import path from "node:path";
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Configure dotenv
dotenv.config();

// Configure mongo & redis
const mongo = getMongo();

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
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

    // Add any guilds to database that aren't already there
    // This technically should never happen, but just in case
    for (const [, guild] of client.guilds.cache) {
        await addNewGuildToDatabase(guild);
    }
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

    await addNewGuildToDatabase(guild);
});

client.on(Events.GuildDelete, async guild => {
    console.info(`[${new Date().toISOString()}] [Guild Removed] ${guild.id} | ${guild.name}`);

    await mongo.database
        .collection("guilds")
        .updateOne(
            { guildID: guild.id },
            {
                $set: { active: false }
            },
            { upsert: false }
        );
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

// Helpers
async function addNewGuildToDatabase(guild: Guild) {
    await mongo.database
        .collection("guilds")
        .updateOne(
            { guildID: guild.id },
            {
                $set: { active: true }, // Always do this

                $setOnInsert: { // Only do this if the doc doesn't exist already
                    guildID: guild.id,
                    permittedToVerify: [],
                    nsfwRole: "",
                    accessRole: ""
                }
            },
            { upsert: true }
        );
}