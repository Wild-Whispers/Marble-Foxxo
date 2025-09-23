import cron from "node-cron";
import { E621Manager } from "../e621/E621Manager";
import { Actions } from "../DatabaseActions/Actions";

export function scheduleFetchE6Media() {
    // Run every hour
    cron.schedule("0 * * * *", async () => {
        await fetchE6Media();
    });
}

export async function fetchE6Media() {
    // Configure
    const amountToFetchPer = 100;

    // Get manager
    const manager = new E621Manager("QuietWind01", process.env.E6_SECRET!);

    // Fetch all
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const allPosts: any = [
        ...await manager.fetchMultiple(["gay", "canine", "wolf", "anal"], amountToFetchPer),

    ];

    // Cache to Redis
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    allPosts.forEach(async (post: any) => {
        await Actions.cacheE6Media(post);
    });
}