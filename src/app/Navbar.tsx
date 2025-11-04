"use client";

import Row from "@/components/Row";
import Image from "next/image";
import NavbarEndSection from "./NavbarEndSection";

export default function Navbar() {
    return (
        <Row
            id="navbar"
            classes="
                justify-between
                p-4
                bg-[linear-gradient(to_right,_#042f2e_0%,_#042f2e00_5%,_#09090b_50%,_#042f2e00_95%,_#042f2e_100%)]
                border-b
                border-[#FF2DA0]
            "
        >

            <Image alt="Navbar banner" src="/assets/navbar-banner-v2-beta.png" width={2000} height={350} className="w-65" priority />

            <NavbarEndSection />

        </Row>
    );
}