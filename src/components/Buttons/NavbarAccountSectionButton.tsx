"use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function NavbarAccountSectionButton({ text, href }: { text: string | ReactNode, href: string }) {
    return (
        <Link
            href={href}
            className="
                flex
                flex-row
                items-center
                p-1.5

                bg-gradient-to-tr
                from-[#FF2DA0]
                via-[#BD1972]
                to-[#FF2DA0]

                hover:bg-gradient-to-tr
                hover:from-[#BD1972]
                hover:via-[#BD1972]
                hover:to-[#BD1972]

                text-white
                font-semibold
                rounded-md
                cursor-pointer

                gap-2
            "
        >
            {text}
        </Link>
    );
}