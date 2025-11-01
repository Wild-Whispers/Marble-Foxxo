import Col from "@/components/Col";
import Row from "@/components/Row";
import { ReactNode } from "react";
import DashboardNavButton from "./DashboardNavButton";
import { HashtagIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { cookies } from "next/headers";
import GuildsDropdown from "./GuildsDropdown";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("discord_token")?.value;

    // Fetch user guilds
    let guilds: any = []; /* eslint-disable-line @typescript-eslint/no-explicit-any */
    if (accessToken) {
        // Fetch user's guilds
        const userGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Fetch bot's guilds
        const botGuildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: { Authorization: `Bot ${process.env.MARBLE_FOXXO_TOKEN}` },
        });

        if (userGuildsRes.ok && botGuildsRes.ok) {
            const userGuilds = await userGuildsRes.json();
            const botGuilds = await botGuildsRes.json();

            // Get mutual guilds
            const mutualGuilds = userGuilds.filter((userGuild: any) => /* eslint-disable-line @typescript-eslint/no-explicit-any */
                botGuilds.some((botGuild: any) => botGuild.id === userGuild.id) /* eslint-disable-line @typescript-eslint/no-explicit-any */
            );

            // Filter to get only guilds the user can manage
            const manageableGuilds = mutualGuilds.filter(
                (g: any) => g.owner || (BigInt(g.permissions) & BigInt(0x20)) === BigInt(0x20) /* eslint-disable-line @typescript-eslint/no-explicit-any */
            );

            guilds = manageableGuilds;
        }
    }

    // Construct nav links
    const navLinks = [
        { href: "/dashboard", label: "My Overview", icon: <ShieldExclamationIcon width={20} height={20} /> },
        { href: `/dashboard/channels`, label: "Channels", icon: <HashtagIcon width={20} height={20} /> },
    ];

    return (
        <Row
            id="dashboard-container"
            classes="
                w-full

                bg-neutral-700
                text-white
            "
        >

            <Col
                id="dashboard-sidebar"
                classes="
                    min-w-[245px]
                    flex-1
                    p-2

                    bg-neutral-900
                    gap-4
                "
            >

                <p className="text-md font-semibold">Guild</p>

                <GuildsDropdown guildsList={guilds} />

                {
                    guilds.length > 0 && <Col>
                        {
                            navLinks.map((link: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                                return (
                                    <DashboardNavButton key={i} href={link.href} content={
                                            <>
                                                {link.icon}
                                                <p>{link.label}</p>
                                            </>
                                        }
                                    />
                                );
                                
                            })
                        }
                    </Col>
                }
            </Col>

            <Col
                id="dashboard-content"
                classes="
                    flex-4
                    p-2
                "
            >
                {children}
            </Col>

        </Row>
    );
}