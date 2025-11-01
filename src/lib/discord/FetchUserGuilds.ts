import { DiscordFetchReturn } from "@/_Interfaces/DiscordFetchReturn";

export async function DiscordFetchUserGuilds(accessToken: string): Promise<DiscordFetchReturn> {
    try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error("Discord API Error: " + error.toString());
        }

        const data = await res.json();

        return {
            data
        };
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error(error);

        return {
            message: "Error: " + error,
            data: null
        };
    }
}