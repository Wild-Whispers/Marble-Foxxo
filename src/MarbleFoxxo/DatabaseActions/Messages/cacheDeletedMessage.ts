import { getRedis } from "@/lib/redis";
import { Message, PartialMessage } from "discord.js";
import { Actions } from "../Actions";
import { CachedGuildMessage } from "@/_Interfaces/CachedGuildMessage";
import { CachedGuildDeletedMessage } from "@/_Interfaces/CachedGuildDeletedMessage";

const func = {
    async cacheDeletedMessage(message: Message | PartialMessage) {
        const redis = await getRedis();

        // Fetch original message from cache
        const cachedOldMsgRaw = await Actions.fetchCachedMessage(message);

        const cachedOldMsg: CachedGuildMessage = { ...cachedOldMsgRaw };

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
};

export default func;