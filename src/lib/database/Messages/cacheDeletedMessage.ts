import { getRedis } from "@/lib/redis";
import { Message, PartialMessage } from "discord.js";
import { CachedGuildMessage } from "@/_Interfaces/CachedGuildMessage";
import { CachedGuildDeletedMessage } from "@/_Interfaces/CachedGuildDeletedMessage";
import { fetchCachedMessage } from "./fetchCachedMessage";

export async function cacheDeletedMessage(message: Message | PartialMessage) {
    const redis = await getRedis();

    // Fetch original message from cache
    const cachedOldMsgRaw = await fetchCachedMessage(message as Message);

    const cachedOldMsg = { ...cachedOldMsgRaw } as CachedGuildMessage;

    const key = `deletedmsg:${message.id}`;
    const data: CachedGuildDeletedMessage = {
        authorID: cachedOldMsg.authorID,
        guildID: cachedOldMsg.guildID,
        channelID: cachedOldMsg.channelID,
        createdTimestamp: message.createdTimestamp?.toString() ?? "unknown",
        editedTimestamp: message.editedTimestamp?.toString() ?? "unknown",
        content: cachedOldMsg.content ?? "NOTICE: Message was cached prior to content being collected with messages cache. This message's content is unknown."
    };

    console.log("Caching deleted message")
    
    await redis.hSet(key, data);
}