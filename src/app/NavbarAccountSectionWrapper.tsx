import Row from "@/components/Row";
import { ReactNode } from "react";

export default function NavbarAccountSectionWrapper({ children }: { children: ReactNode }) {
    return (
        <Row
            id="navbar-account-section"
            classes="
                items-center
                bg-teal-600/20
                p-2

                rounded-full
                gap-2
            "
        >
            {children}
        </Row>
    );
}