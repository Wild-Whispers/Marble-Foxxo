"use client";

import Row from "@/components/Row";
import Image from "next/image";
import NavbarAccountSection from "./NavbarAccountSection";
import Link from "next/link";

export default function Navbar() {

    return (
        <Row
            id="navbar"
            classes="
                justify-between
                p-4
                bg-[linear-gradient(to_right,_#042f2e_0%,_#042f2e00_5%,_#09090b_50%,_#042f2e00_95%,_#042f2e_100%)]
            "
        >

            <Image alt="Navbar banner" src="/assets/navbar-banner-v2-beta.png" width={2000} height={350} className="w-65" priority />

            <Row id="nav-end-section" classes="items-center gap-4">
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
                    href={
                        process.env.NODE_ENV === "development" ?
                        "https://discord.com/oauth2/authorize?client_id=1419047521606570004&permissions=2840998996344823&integration_type=0&scope=bot" :
                        "https://discord.com/oauth2/authorize?client_id=1390546028226412544&permissions=2840998996344823&integration_type=0&scope=bot"
                    }
                >
                    Invite Marble Foxxo
                </Link>

                <NavbarAccountSection />
            </Row>

        </Row>
    );
}