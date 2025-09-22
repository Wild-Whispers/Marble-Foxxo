import { CachedMedia } from "@/_Interfaces/CachedMedia";
import { MediaFile } from "@/_Interfaces/MediaFile";
import { getRedis } from "@/lib/redis";

const func = {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async cacheE6Media(json: any) {
        const redis = await getRedis();

        // Calculate rating and sexual orientation of the post
        const rating = json.rating === "e" ? "NSFW" : "SFW";
        const generalTags = json.tags.general as Array<string>;
        const straight = 
            generalTags.includes("male/female") &&
            !generalTags.includes("male/male");
        const gay =
            generalTags.includes("male/male") &&
            !generalTags.includes("male/female");
        const soloFemale =
            generalTags.includes("female") &&
            !generalTags.includes("male") &&
            !generalTags.includes("male/male") &&
            !generalTags.includes("male/female");
        const soloMale =
            generalTags.includes("male") &&
            !generalTags.includes("female") &&
            !generalTags.includes("male/male") &&
            !generalTags.includes("male/female");
        const orientation =
            straight ? "straight"
                : gay ? "gay"
                    : soloFemale ? "solo-female"
                        : soloMale ? "solo-male"
                            : "unknown-orientation";

        const file: MediaFile = {
            name: json.file.md5 + json.file.ext,
            rating: rating,
            ext: json.file.ext,
            width: json.file.width,
            height: json.file.height,
            size: json.file.size,
            url: json.file.url
        };
        
        const key = `${rating.toLowerCase()}:${orientation}:media:${json.id.toString()}`;
        const data: CachedMedia = {
            mediaID: json.id.toString(),
            rating: rating,
            createdAt: json.created_at,
            updatedAt: json.updated_at,
            file: file,
            score: json.score.total
        };
        
        await redis.hSet(key, { data: JSON.stringify(data) });
    }
};

export default func;