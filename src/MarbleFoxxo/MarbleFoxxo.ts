import {
    Client,
    Events,
    GatewayIntentBits,
    Interaction
} from "discord.js";
import dotenv from "dotenv";
import { getMongo } from "@/lib/mongo";

// Configure dotenv
dotenv.config();

// Configure mongo & redis
const mongo = getMongo();

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

client.on(Events.ClientReady, async readyClient => {

    // Log ready status
    console.info(`[${new Date().toISOString()}] Logged in as ${readyClient.user.tag}!`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
    console.info(`[${new Date().toISOString()}] [Guild Interaction] Interaction Created - ${interaction.channelId}`);
});

client.on("guildDelete", async guild => {
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

client.on("error", (error: Error) => {
    if ((error as NodeJS.ErrnoException).code) {
        const err = error as NodeJS.ErrnoException;
        
        if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "ENOTFOUND") console.error(`[${new Date().toISOString()}] [Discord Client Error] [Network Error] Could not reach Discord:`, error);
        
        return;
    }

    console.error(`[${new Date().toISOString()}] [Discord Client Error]`, error);
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(client.ws as any).on("error", (error: Error) => {
    console.error(`[${new Date().toISOString()}] [Discord Gateway Error]`, error);
});

client.on("shardError", (error, shardId) => {
  console.error(`[${new Date().toISOString()}] [Shard ${shardId} Error] ${error.message}`);
});

client.login(process.env.MARBLE_FOXXO_SECRET).catch((error: Error) => {
    if (error.message.includes("TOKEN_INVALID")) {
        console.error(`[${new Date().toISOString()}] [Bot Login Error] Invalid bot token`);
        return;
    }

    console.error(`[${new Date().toISOString()}] [Bot Login Error]`, error);
});