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
    const amountToFetchPer = 15;

    // Get manager
    const manager = new E621Manager("QuietWind01", process.env.E6_SECRET!);

    // Fetch all
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const allPosts: any = [
        // Gay
        ...await manager.fetchMultiple(["gay"], amountToFetchPer),
        ...await manager.fetchMultiple(["gay", "rating:s"], amountToFetchPer),

        // Straight
        ...await manager.fetchMultiple(["straight"], amountToFetchPer),
        ...await manager.fetchMultiple(["straight", "rating:s"], amountToFetchPer),

        // Male solo
        ...await manager.fetchMultiple(["male", "solo"], amountToFetchPer),
        ...await manager.fetchMultiple(["male", "solo", "rating:s"], amountToFetchPer),

        // Female solo
        ...await manager.fetchMultiple(["female", "solo"], amountToFetchPer),
        ...await manager.fetchMultiple(["female", "solo", "rating:s"], amountToFetchPer),
    ];

    // Cache to Redis
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    allPosts.forEach(async (post: any) => {
        await Actions.cacheE6Media(post);
    });
}