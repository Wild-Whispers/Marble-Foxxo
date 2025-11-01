"use client";

import Dropdown from "@/components/Inputs/Dropdown";
import { useSearchParams } from "next/navigation";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildsDropdown({ guilds, setWorkingGuild }: { guilds: Array<any>, setWorkingGuild: (string: any) => void }) {
    const searchParams = useSearchParams();
    const selectedGuild = searchParams.get("guild") ?? "";

    guilds = guilds.sort((a: any, b: any) => a.name.localeCompare(b.name)); /* eslint-disable-line @typescript-eslint/no-explicit-any */

    return (
        <form id="change-active-guild-form" action="" method="GET">
            <Dropdown
                id="user-guilds-list"
                name="guild"
                defaultValue={selectedGuild}
                onChange={(e: any) => setWorkingGuild(e.currentTarget.value)} /* eslint-disable-line @typescript-eslint/no-explicit-any */
            >
                {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    guilds.map((guild: any, i: number) => {return <option key={i} value={guild.id}>{guild.name}</option>})
                }
            </Dropdown>
        </form>
    );
}