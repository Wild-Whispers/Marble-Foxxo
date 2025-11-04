"use client";

import AvatarSmall from "@/components/DiscordAvatar/AvatarSmall";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import Row from "@/components/Row";
import { useEffect, useState } from "react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function NavbarAccountButton({ user }: { user: any }) {
    const [avatar, setAvatar] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                // Attempt to fetch the user's avatar URL
                const avatarHash = user.avatar;

                fetch(`/api/discord/user/${user.id}/avatar/${avatarHash}`)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setAvatar(res.data);
                    });
            } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                setError("Error fetching avatar: " + error);
            }
        })();
    }, [user]);

    // If still loading avatar
    if (!avatar) return (
        <Row
            id="nav-account-button"
            classes="
                items-center
                p-2
                px-4

                bg-amber-800/30
                
                border-1
                border-[#FF2DA0]

                hover:bg-[#AB1567]/40
                hover:border-[#E01D88]

                rounded-full
                font-semibold
                gap-2
            "
        >
            <LoadingSpinner />
        </Row>
    );

    // If error
    if (error) return (
        <Row
            id="nav-account-button"
            classes="
                items-center
                p-2
                px-4

                bg-amber-800/30
                
                border-1
                border-[#FF2DA0]

                hover:bg-[#AB1567]/40
                hover:border-[#E01D88]

                rounded-full
                font-semibold
                gap-2
            "
        >
            <ErrorMessage description={error} />
        </Row>
    );

    return (
        <Row
            id="nav-account-button"
            classes="
                items-center
                p-2
                px-4

                bg-amber-800/30
                
                border-1
                border-[#FF2DA0]

                hover:bg-[#AB1567]/40
                hover:border-[#E01D88]

                rounded-full
                font-semibold
                gap-2
            "
        >
            <AvatarSmall username={user.username} avatarURL={avatar} />
            <p className="text-xs">{user.global_name ?? user.username}</p>
        </Row>
    );
}