"use client";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function NavbarSigninButton() {
    return (
        <Link
            id="nav-signin-button"
            className="
                flex
                flex-row
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
            href={
                process.env.NODE_ENV === "development" ?
                "https://discord.com/oauth2/authorize?client_id=1419047521606570004&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&scope=identify+guilds+email" :
                "https://discord.com/oauth2/authorize?client_id=1390546028226412544&response_type=code&redirect_uri=https%3A%2F%2Fmarblefoxxo.wildwhispers.xyz%2Fapi%2Fauth%2Fcallback&scope=identify+guilds+email"
            }
        >
            Sign In via Discord <ArrowTopRightOnSquareIcon width={15}  height={15} />
        </Link>
    );
}