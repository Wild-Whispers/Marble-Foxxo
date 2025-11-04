"use client";

import Link from "next/link";

export default function NavbarDashboardButton() {
    return (
        <Link
            id="nav-dashboard-button"
            className="
                p-2
                px-4

                bg-amber-800/30
                
                border-1
                border-[#FF2DA0]

                hover:bg-[#AB1567]/40
                hover:border-[#E01D88]

                rounded-full
                font-semibold
            "
            href="/dashboard"
        >
            My Dashboard
        </Link>
    );
}