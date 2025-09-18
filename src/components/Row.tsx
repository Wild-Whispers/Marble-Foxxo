import { HTMLAttributes, ReactNode } from "react";

export default function Row({ classes, children, ...props }: { classes?: string, children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return <div className={`flex flex-row ${classes}`} {...props}>{children}</div>;
}