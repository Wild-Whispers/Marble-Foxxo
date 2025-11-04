import Image from "next/image";
import Col from "../Col";

export default function AvatarSmall({ username, avatarURL }: { username: string, avatarURL: string }) {
    return (
        <Col
            classes="
                border-2
                border-white/60
                rounded-full
            "
        >
            <Image
                alt={`${username}'s Avatar - Small`}
                src={avatarURL}
                width={256}
                height={256}
                className="w-5 h-5 rounded-full"
            />
        </Col>
    );
}