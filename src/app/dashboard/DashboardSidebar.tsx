"use client";

import Col from "@/components/Col";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import { Cog6ToothIcon, HashtagIcon, InformationCircleIcon, ShieldExclamationIcon, UserIcon } from "@heroicons/react/24/solid";
import GuildsDropdown from "./GuildsDropdown";
import DashboardNavButton from "./DashboardNavButton";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function DashboardSidebar({ accessToken, guilds }: { accessToken: string | null | undefined, guilds: Array<any> | null | undefined }) {
    const [guildParam, setGuildParam] = useState<string>(guilds && guilds.length > 0 ? guilds[0].id : "null");
    const [userIsManager, setUserIsManager] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedGuildID, setSelectedGuildID] = useState<string | null>(null);
    const userDataRaw = Cookies.get("discord_user");

    useEffect(() => {
        (async () => {
            try {
                // Fetch if user is manager
                fetch(`/api/discord/guild-member/${guildParam}/can-manage`, { headers: { "Authorization": `Bearer ${accessToken}` } })
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setUserIsManager(res.data);
                    });
            } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                setError(error.toString());
            }
        })();
    }, [userDataRaw, guildParam, accessToken]);

    useEffect(() => {
        try {
            // Check for specific errors
        if (!userDataRaw) throw new Error("Your session has expired. Please sign in again.");
        } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
            setError(error.toString());
        }

        setSelectedGuildID(searchParams.get("guild"));
    }, [accessToken, userDataRaw, guilds, searchParams]);

    const setWorkingGuild = (guildID: string) => {
        setGuildParam(guildID);

        router.push(`?guild=${guildID}`);
    };

    interface NavLink {
        href: string,
        label: string,
        icon: ReactNode
    }

    const managementOnlyNavLinks: Array<NavLink> = [
        { href: `/dashboard/guild-overview?guild=${guildParam}`, label: "Guild Overview", icon: <ShieldExclamationIcon width={20} height={20} /> },
        { href: `/dashboard/settings?guild=${guildParam}`, label: "Settings", icon: <Cog6ToothIcon width={20} height={20} /> },
        { href: `/dashboard/channels?guild=${guildParam}`, label: "Channels", icon: <HashtagIcon width={20} height={20} /> },
        { href: `/dashboard/roles?guild=${guildParam}`, label: "Roles", icon: <UserIcon width={20} height={20} /> },
    ];

    let navLinks: Array<NavLink> = [
        { href: "/dashboard", label: "My Overview", icon: <InformationCircleIcon width={20} height={20} /> },
    ];

    if (userIsManager) navLinks = [
        ...navLinks,
        ...managementOnlyNavLinks
    ];

    if (!accessToken) return <ErrorMessage description="Your session has expired. Please sign in again." />;
    if (!guilds) return <ErrorMessage description="There was an error fetching your guilds." />;
    if (accessToken && guilds.length === 0) return <ErrorMessage description="Your share no guilds with Marble Foxxo." />;
    if (error) return <ErrorMessage description={error} />;

    return (
        <Col id="dashboard-sidebar-content" classes="gap-2">
            <GuildsDropdown guilds={guilds!} selectedGuildID={selectedGuildID ?? guilds![0].id} setWorkingGuild={setWorkingGuild} />

            <Col id="dashboard-sidebar-navigation-links">
                {
                    navLinks.map((link: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                        const cleanHref = link.href.split("?")[0];

                        let isActive;
                        if (cleanHref === "/dashboard") {
                            isActive = pathname === "/dashboard";
                        } else {
                            isActive = pathname.startsWith(cleanHref);
                        }

                        return (
                            <DashboardNavButton
                                key={i}
                                href={link.href}
                                isActive={isActive}
                                content={
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
        </Col>
    );
}