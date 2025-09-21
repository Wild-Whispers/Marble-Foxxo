import { getRedis } from "@/lib/redis";

const func = {
    async deleteCachedMessage(key: string) {
        const redis = await getRedis();

        await redis.del(key);
    }
};

export default func;