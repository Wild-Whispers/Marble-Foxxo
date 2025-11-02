import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardNavButton({ href, content, isActive }: { href: string, content: ReactNode, isActive: boolean }) {
    if (isActive) return (
        <Link
            href={href}
            className="
                flex
                flex-row
                justify-start
                items-center
                p-2

                rounded-sm
                bg-gradient-to-r
                from-teal-700/50
                via-teal-50/1
                to-teal-50/1

                hover:from-teal-400/50
                hover:via-teal-50/1
                hover:to-teal-50/1

                gap-2
            "
        >
            {content}
        </Link>
    );

    return <Link
        href={href}
        className="
            flex
            flex-row
            justify-start
            items-center
            p-2

            rounded-sm
            hover:bg-gradient-to-r
            from-teal-400/50
            via-teal-50/1
            to-teal-50/1

            gap-2
        "
    >
        {content}
    </Link>;
}