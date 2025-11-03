"use client";

import Dropdown from "@/components/Inputs/Dropdown";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildsDropdown({ guilds, selectedGuildID, setWorkingGuild }: { guilds: Array<any>, selectedGuildID: string, setWorkingGuild: (string: any) => void }) {
    return (
        <form id="change-active-guild-form" action="" method="GET">
            <Dropdown
                id="user-guilds-list"
                name="guild"
                value={selectedGuildID ?? guilds![0].id}
                onChange={(e: any) => setWorkingGuild(e.currentTarget.value)} /* eslint-disable-line @typescript-eslint/no-explicit-any */
            >
                {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    guilds!.map((guild: any, i: number) => {return <option key={i} value={guild.id}>{guild.name}</option>})
                }
            </Dropdown>
        </form>
    );
}