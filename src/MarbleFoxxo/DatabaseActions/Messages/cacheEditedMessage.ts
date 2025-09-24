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

        const cachedOldMsg: CachedGuildMessage = { ...cachedOldMsgRaw };

        const key = `editedmsg:${newMsg.id}`;
        const data: CachedGuildEditedMessage = {
            messageID: newMsg.id,
            authorID: cachedOldMsg.authorID,
            guildID: cachedOldMsg.guildID,
            channelID: cachedOldMsg.channelID,
            createdTimestamp: newMsg.createdTimestamp?.toString() ?? "unknown",
            editedTimestamp: newMsg.editedTimestamp?.toString() ?? "unknown",
            oldContent: cachedOldMsg.content,
            newContent: newMsg.content ?? "NOTICE: Message was cached prior to content being collected with messages cache. This message's content is unknown."
        };
        
        await redis.hSet(key, data);
    }
};

export default func;