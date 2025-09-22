export interface MediaFile {
    name: string,
    rating: "NSFW" | "SFW",
    ext?: string,
    width?: number | string,
    height?: number | string,
    size?: number | string,
    url: string,
}