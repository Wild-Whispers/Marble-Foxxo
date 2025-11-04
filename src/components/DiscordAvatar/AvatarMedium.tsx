import Image from "next/image";
import Col from "../Col";

export default function AvatarMedium({ username, avatarURL }: { username: string, avatarURL: string }) {
    return (
        <Col
            classes="
                border-2
                border-white/60
                rounded-full
            "
        >
            <Image
                alt={`${username}'s Avatar - Medium`}
                src={avatarURL}
                width={256}
                height={256}
                className="w-10 h-10 rounded-full"
            />
        </Col>
    );
}