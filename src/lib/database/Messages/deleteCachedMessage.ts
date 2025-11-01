import { getRedis } from "@/lib/redis";

export async function deleteCachedMessage(key: string) {
    const redis = await getRedis();

    await redis.del(key);
}