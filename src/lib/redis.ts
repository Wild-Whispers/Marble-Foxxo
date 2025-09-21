import { createClient, RedisClientType } from "redis";

let redis: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
    if (!redis) {
        if (!process.env.REDIS_URI) throw new Error("Missing process.env.REDIS_URI");

        redis = createClient({
            url: process.env.REDIS_URI
        });

        // Attach redis error handler
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        redis.on("error", (err: any) => console.error(`[${new Date().toISOString()}] [Redis Error]`, err));

        await redis.connect();
    }

    return redis;
}