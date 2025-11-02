"use client";

import Link from "next/link";

export default function NavbarAccountSectionButton({ text, href }: { text: string, href: string }) {
    return (
        <Link
            href={href}
            className="
                p-1.5
                
                bg-gradient-to-tr
                from-teal-400
                via-teal-600
                to-teal-400

                hover:bg-gradient-to-tr
                hover:from-teal-600
                hover:via-teal-600
                hover:to-teal-600

                text-white
                font-semibold
                rounded-md
                cursor-pointer
            "
        >
            {text}
        </Link>
    );
}