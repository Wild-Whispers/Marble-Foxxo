"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Row from "@/components/Row";
import NavbarDashboardButton from "./NavbarDashboardButton";
import NavbarBotInviteButton from "./NavbarBotInviteButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavbarSigninButton from "./NavbarSigninButton";
import NavbarAccountButton from "./NavbarAccountButton";

export default function NavbarEndSection() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setMounted(true);

        const userRaw = Cookies.get("discord_user");
        if (!userRaw) return;

        try {
            setUser(JSON.parse(userRaw));
        } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
            console.error("User parse error:", error);
        }
    }, []);

    // Render static before mount
    if (!mounted) return (
        <Row id="nav-end-section" classes="items-center gap-4">
            <NavbarBotInviteButton />
            <NavbarSigninButton />
        </Row>
    );

    if (!user) return (
        <Row id="nav-end-section" classes="items-center gap-4">
            <LoadingSpinner />
        </Row>
    );

    // User is signed in successfully
    return (
        <Row id="nav-end-section" classes="items-center gap-4">
            <NavbarDashboardButton />
            <NavbarBotInviteButton />
            <NavbarAccountButton user={user} />
        </Row>
    );
}