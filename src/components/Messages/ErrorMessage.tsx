import Col from "../Col";

export default function ErrorMessage({ title, description }: { title?: string, description: string }) {
    return (
        <Col
            classes="
                w-full
                p-2
                bg-red-400/30
                border-1
                border-red-400
                rounded-xs
            "
        >
            <p className="text-xl text-white">{title}</p>
            <p className="text-sm text-white">{description}</p>
        </Col>
    );
}