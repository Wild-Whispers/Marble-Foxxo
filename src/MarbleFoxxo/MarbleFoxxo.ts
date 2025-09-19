import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Interaction
} from "discord.js";
import dotenv from "dotenv";
import { getMongo } from "@/lib/mongo";
import path from "node:path";
import { readdirSync } from "node:fs";

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

// Register commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, "src", "MarbleFoxxo", "Discord", "Commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`[${new Date().toISOString()}] [Command Register] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

/* ------------------------------------------------------------ Listeners ------------------------------------------------------------ */
client.on(Events.ClientReady, async readyClient => {
    // Log ready status
    console.info(`[${new Date().toISOString()}] Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    console.info(`[${new Date().toISOString()}] [Guild Interaction] Interaction Created - ${interaction.channelId}`);
});

client.on(Events.GuildCreate, async guild => {
    console.info(`[${new Date().toISOString()}] [Guild Added] ${guild.id} | ${guild.name}`);
});

client.on(Events.GuildDelete, async guild => {
    console.info(`[${new Date().toISOString()}] [Guild Removed] ${guild.id} | ${guild.name}`);
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