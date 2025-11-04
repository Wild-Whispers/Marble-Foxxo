import Image from "next/image";
import Col from "../Col";

export default function AvatarLarge({ username, avatarURL }: { username: string, avatarURL: string }) {
    return (
        <Col
            classes="
                border-2
                border-white/60
                rounded-full
            "
        >
            <Image
                alt={`${username}'s Avatar - Large`}
                src={avatarURL}
                width={256}
                height={256}
                className="w-15 h-15 rounded-full"
            />
        </Col>
    );
}