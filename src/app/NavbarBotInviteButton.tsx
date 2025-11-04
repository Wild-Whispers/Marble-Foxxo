"use client";

import Link from "next/link";

export default function NavbarBotInviteButton() {
    const inviteURL = process.env.NODE_ENV === "development" ?
        "https://discord.com/oauth2/authorize?client_id=1419047521606570004&permissions=2840998996344823&integration_type=0&scope=bot" :
        "https://discord.com/oauth2/authorize?client_id=1390546028226412544&permissions=2840998996344823&integration_type=0&scope=bot";

    return (
        <Link
            id="nav-bot-invite-button"
            className="
                p-2
                px-4

                bg-violet-800/30
                
                border-1
                border-violet-600

                hover:bg-violet-800/40
                hover:border-violet-500

                rounded-full
                font-semibold
            "
            href={inviteURL}
        >
            Invite Marble Foxxo
        </Link>
    );
}