import Col from "@/components/Col";
import Image from "next/image";

export default function DashboardLoading() {
    return (
        <Col id="loading" classes="justify-center items-center gap-2">
            <h1 className="text-2xl font-semibold">Please wait, Milo is thinking...</h1>

            <Image alt="Milo is thinking..." src="/assets/the_marble_grove.png" width={500} height={500} className="rounded-md" />
        </Col>
    );
}