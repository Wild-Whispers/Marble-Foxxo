import { CachedGuildEditedMessage } from "@/_Interfaces/CachedGuildEditedMessage";
import { getRedis } from "@/lib/redis";
import { Message, PartialMessage } from "discord.js";
import { Actions } from "../Actions";
import { CachedGuildMessage } from "@/_Interfaces/CachedGuildMessage";

const func = {
    async cacheEditedMessage(oldMsg: Message | PartialMessage, newMsg: Message) {
        const redis = await getRedis();

        // Fetch original message from cache
        const cachedOldMsgRaw = await Actions.fetchCachedMessage(newMsg);

        if (!cachedOldMsgRaw.content) {
            console.info(`[${new Date().toISOString()}] [Cached Message] Message 'msg:${cachedOldMsgRaw.messageID}' was cached prior to edited messages cache implementation, its edit will not be cached.`);

            return;
        }

        const cachedOldMsg: CachedGuildMessage = { ...cachedOldMsgRaw };

        const key = `editedmsg:${newMsg.id}`;
        const data: CachedGuildEditedMessage = {
            authorID: newMsg.author.id,
            guildID: newMsg.guildId!,
            channelID: newMsg.channelId,
            createdTimestamp: newMsg.createdTimestamp.toString(),
            editedTimestamp: newMsg.editedTimestamp!.toString(),
            oldContent: cachedOldMsg.content,
            newContent: newMsg.content
        };
        
        await redis.hSet(key, data);
    }
};

export default func;