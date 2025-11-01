"use client";

import ErrorMessage from "@/components/Messages/ErrorMessage";
import { useSearchParams } from "next/navigation";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildsDropdown({ guildsList }: { guildsList: Array<any> }) {
    const searchParams = useSearchParams();
    const selectedGuild = searchParams.get("guild") ?? "";

    if (guildsList.length === 0) return <ErrorMessage title=":(" description="There no guilds you are eligible to manage via Marble Foxxo." />;

    const guilds = guildsList.sort((a: any, b: any) => a.name.localeCompare(b.name)); /* eslint-disable-line @typescript-eslint/no-explicit-any */

    return (
        <form action="/dashboard/channels" method="GET">
            <select
                id="user-guilds-list"
                name="guild"
                defaultValue={selectedGuild}
                onChange={(e: any) => e.currentTarget.form?.submit()} /* eslint-disable-line @typescript-eslint/no-explicit-any */
                className="bg-neutral-900 text-white rounded-sm"
            >
                {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    guilds.map((guild: any, i: number) => {return <option key={i} value={guild.id}>{guild.name}</option>})
                }
            </select>
        </form>
    );
}