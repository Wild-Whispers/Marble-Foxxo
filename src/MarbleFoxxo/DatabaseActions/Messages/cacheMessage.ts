import { CachedGuildMessage } from "@/_Interfaces/CachedGuildMessage";
import { getRedis } from "@/lib/redis";
import { Message } from "discord.js";

const func = {
    async cacheMessage(message: Message) {
        const redis = await getRedis();

        const key = `msg:${message.id}`;
        const data: CachedGuildMessage = {
            messageID: message.id,
            guildID: message.guildId!,
            channelID: message.channelId,
            authorID: message.author.id
        };
        
        await redis.hSet(key, data);
    }
};

export default func;