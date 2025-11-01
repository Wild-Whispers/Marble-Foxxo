import { getRedis } from "@/lib/redis";
import { Message } from "discord.js";

export async function fetchCachedMessage(message: Message) {
    const redis = await getRedis();

    const key = `msg:${message.id}`;
    const data = await redis.hGetAll(key);

    if (!data || !data.authorID) {
        console.warn(`[${new Date().toISOString()}] [Redis] Message '${message.id}' not found in redis cache.`);

        return null;
    }

    return data;
}