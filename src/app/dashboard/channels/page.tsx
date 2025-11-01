import UpdateChannels from "@/components/Forms/UpdateChannels";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import { fetchGuildByID } from "@/lib/database/Guilds/fetchGuildByID";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default async function DashboardChannels({searchParams }: { searchParams: any }) {
    const guildID = (await searchParams).guild;

    try {
        // Fetch guild's channels
        const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guildID}/channels`, {
            headers: { Authorization: `Bot ${process.env.MARBLE_FOXXO_TOKEN}` },
        });

        if (!guildRes.ok) {
            const error = await guildRes.text();
            throw new Error("Discord API Error: Something went wrong fetching guild: " + error.toString());
        }

        const channelsRaw = await await guildRes.json();
        const channels = channelsRaw.filter((channel: any) => channel.type === 0); /* eslint-disable-line @typescript-eslint/no-explicit-any */

        // Fetch the guild from DB
        const guildResult = await fetchGuildByID(guildID);
        if (!guildResult) throw new Error(`Guild with ID ${guildID} not found!`);

        const { _id, ...guildData } = guildResult;

        return <UpdateChannels guildID={guildID} guildData={guildData} channels={channels} />;
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        return <ErrorMessage title=":(" description={error.toString()} />;
    }
}