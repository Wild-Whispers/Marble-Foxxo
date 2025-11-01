"use client";

import { ReactNode, SelectHTMLAttributes } from "react";

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export default function Dropdown(props: DropdownProps) {
    return (
        <select
            className="
                w-full
                p-1.5
                bg-zinc-900
                text-white
                rounded-sm

                border-1
                border-zinc-700
                focus:border-zinc-600

                hover:border-zinc-600
                outline-none
            "
            {...props}
        >
            {props.children}
        </select>
    );
}