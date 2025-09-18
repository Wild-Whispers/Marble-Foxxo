import { HTMLAttributes, ReactNode } from "react";

export default function Col({ classes, children, ...props }: { classes?: string, children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return <div className={`flex flex-col ${classes}`} {...props}>{children}</div>;
}