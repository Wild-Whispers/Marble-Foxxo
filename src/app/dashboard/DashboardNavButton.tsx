import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardNavButton({ href, content }: { href: string, content: ReactNode }) {
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
            via-teal-50/5
            to-teal-50/5
            gap-2
        "
    >
        {content}
    </Link>;
}