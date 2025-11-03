import Col from "@/components/Col";
import Image from "next/image";

export default async function Home() {
    return (
        <Col
            id="home-page-content"
            classes="
                items-center
                w-full
                p-4

                bg-gradient-to-b
                from-teal-950
                via-teal-800
                via-teal-700
                to-teal-800
            "
        >
            <h1 className="text-3xl font-semibold font-serif">Welcome to</h1>
            <Image alt="Navbar banner" src="/assets/navbar-banner-v2-beta.png" width={2000} height={350} className="w-200" priority />
            <p className="text-xl font-semibold font-serif">...and meet Milo the Marble Fox!</p>
            <p className="text-md font-semibold font-serif">v1.0.0-beta</p>
        </Col>
    );
}
