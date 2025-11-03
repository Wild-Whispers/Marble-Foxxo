import Col from "@/components/Col";
import Row from "@/components/Row";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { DiscordFetchUserGuilds } from "@/lib/discord/FetchUserGuilds";
import { DiscordFetchBotGuilds } from "@/lib/discord/FetchBotGuilds";
import DashboardSidebar from "./DashboardSidebar";
import ErrorMessage from "@/components/Messages/ErrorMessage";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("discord_token")?.value;

    // Fetch user guilds
    let guilds: any = []; /* eslint-disable-line @typescript-eslint/no-explicit-any */
    if (accessToken) {
        // Fetch user and bot's guilds
        const { data: userGuilds } = await DiscordFetchUserGuilds(accessToken);
        const { data: botGuilds } = await DiscordFetchBotGuilds();

        // Get mutual guilds
        const mutualGuilds = userGuilds.filter((userGuild: any) => /* eslint-disable-line @typescript-eslint/no-explicit-any */
            botGuilds.some((botGuild: any) => botGuild.id === userGuild.id) /* eslint-disable-line @typescript-eslint/no-explicit-any */
        );

        // Filter to get only guilds the user can manage
        const manageableGuilds = mutualGuilds.filter(
            (g: any) => g.owner || (BigInt(g.permissions) & BigInt(0x20)) === BigInt(0x20) /* eslint-disable-line @typescript-eslint/no-explicit-any */
        );

        guilds = manageableGuilds;
        guilds = guilds.sort((a: any, b: any) => a.name.localeCompare(b.name)); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    }

    return (
        <Row
            id="dashboard-container"
            classes="
                w-full
                flex-grow

                bg-zinc-950
                text-white
            "
        >

            <Col
                id="dashboard-sidebar"
                classes="
                    min-w-[245px]
                    flex-1
                    p-2
    
                    bg-teal-950
                    gap-4
                "
            >
                <h1 className="text-2xl font-semibold">Manage Your Guilds</h1>
                <DashboardSidebar accessToken={accessToken} guilds={guilds} />
            </Col>

            <Col
                id="dashboard-content"
                classes="
                    flex-4
                    p-2
                "
            >
                {
                    accessToken ? children
                    :
                    <ErrorMessage description="Your session has expired. Please sign in again." />
                }
            </Col>

        </Row>
    );
}