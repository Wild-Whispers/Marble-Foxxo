export async function FetchDiscordAvatarURL(user_id: string, avatarHash: string) {
    const ext = avatarHash?.startsWith("a_") ? "gif" : "png";
    const avatar = avatarHash
        ? `https://cdn.discordapp.com/avatars/${user_id}/${avatarHash}.${ext}?size=1024`
        : `https://cdn.discordapp.com/embed/avatars/${Number(user_id) % 6}.png`;

    return avatar;
}