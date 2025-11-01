export async function FetchDiscordBannerURL(user_id: string, bannerHash: string) {
    const bannerExt = bannerHash?.startsWith("a_") ? "gif" : "png";
    const banner = bannerHash
        ? `https://cdn.discordapp.com/banners/${user_id}/${bannerHash}.${bannerExt}?size=1024`
        : null;

    return banner;
}