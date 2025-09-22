import { MediaFile } from "./MediaFile";

export interface CachedMedia {
    mediaID: string,
    rating: "NSFW" | "SFW",
    createdAt: string,
    updatedAt: string,
    file: MediaFile,
    score: number
}