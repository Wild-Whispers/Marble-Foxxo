"use client";

import Col from "@/components/Col";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardGuildRoles() {
    const searchParams = useSearchParams();
    const [guildData, setGuildData] = useState<any | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [DBGuildData, setDBGuildData] = useState<any | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [error, setError] = useState<string | null>(null);

    const guildID = searchParams.get("guild");

    useEffect(() => {
        (async () => {
            try {
                if (!guildID) throw new Error("guildID not set!");

                // Fetch guild from Discord
                fetch(`/api/discord/guild/${guildID}`)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setGuildData(res.data);
                    });

                // Fetch the guild from DB
                fetch(`/api/database/guild/${guildID}`)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setDBGuildData(res.data);
                    })
                    .catch(fetchError => setError(String(fetchError)));
            } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                setError(error.toString());
            }
        })();
    }, [guildID]);

    if (error) return <ErrorMessage title=":(" description={error} />;

    return (
        <Col id="dashboard-channels" classes="gap-2">
            <h1 className="flex flex-row items-center text-2xl font-semibold gap-2">Guild Roles - {!guildData ? <LoadingSpinner size={20} thickness={2} /> : guildData.name}</h1>

            {
                !guildID ||
                !DBGuildData ?
                <LoadingSpinner size={16} thickness={2}/> :
                "Reminder to self: Write page content here"
            }
        </Col>
    );
}