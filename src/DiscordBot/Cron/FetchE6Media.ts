import cron from "node-cron";
import { E621Manager } from "../e621/E621Manager";
import { cacheE6Media } from "@/lib/database/Media/cacheE6Media";
import { getSettings } from "@/getSettings";

const settings = getSettings();

export function scheduleFetchE6Media() {
    // Run every hour if settings allow for it
    if (settings.art_settings.use_art_scraper) {
        cron.schedule("0 * * * *", async () => await fetchE6Media());
    }
}

export async function fetchE6Media() {
    // Configure
    const amountToFetchPer = 15;

    // Get manager
    const manager = new E621Manager(settings.art_settings.e621_api_username, process.env.E6_SECRET!);

    // Fetch all
    const allPosts: any = [ /* eslint-disable-line @typescript-eslint/no-explicit-any */
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
    allPosts.forEach(async (post: any) => await cacheE6Media(post)); /* eslint-disable-line @typescript-eslint/no-explicit-any */
}