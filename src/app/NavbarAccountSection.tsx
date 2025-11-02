import NavbarAccountSectionButton from "@/components/Buttons/NavbarAccountSectionButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import NavbarAccountSectionWrapper from "./NavbarAccountSectionWrapper";

export default function NavbarAccountSection() {
    const [avatar, setAvatar] = useState<string>("");
    const [user, setUser] = useState<any | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [error, setError] = useState<string | null>(null);
    const userDataRaw = Cookies.get("discord_user");

    useEffect(() => {
        (async () => {
            try {
                if (!userDataRaw) {
                    setError("User not found!");
                    return;
                }

                const user = JSON.parse(userDataRaw);
                setUser(user);
                const avatarHash = user.avatar;

                fetch(`/api/discord/user/${user.id}/avatar/${avatarHash}`)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setAvatar(res.data);
                    });
            } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                console.error("Error fetching avatar:", error);

                setError("Error fetching avatar: " + error);
            }
        })();
    }, [userDataRaw, user?.id, user?.avatar]);

    if (error) return (
        <NavbarAccountSectionWrapper>
            <ErrorMessage description={error} />
        </NavbarAccountSectionWrapper>
    );

    if (!userDataRaw || !user) return (
        <NavbarAccountSectionWrapper>
            <NavbarAccountSectionButton
                text="Sign In via Discord"
                href={
                    process.env.NODE_ENV === "development" ?
                    "https://discord.com/oauth2/authorize?client_id=1419047521606570004&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&scope=identify+guilds+email" :
                    "https://discord.com/oauth2/authorize?client_id=1390546028226412544&response_type=code&redirect_uri=https%3A%2F%2Fmarblefoxxo.wildwhispers.xyz%2Fapi%2Fauth%2Fcallback&scope=identify+guilds+email"
                }
                />
        </NavbarAccountSectionWrapper>
    );

    if (!user.id || !user.username || !avatar) return (
        <NavbarAccountSectionWrapper>
            <LoadingSpinner />
        </NavbarAccountSectionWrapper>
    );

    return (
        <NavbarAccountSectionWrapper>

            <Image
                alt={`${user.username}'s Avatar`}
                src={avatar}
                width={256}
                height={256}
                className="
                    w-7
                    h-7
                    rounded-full
                "
            />

            <p className="font-semibold">Quiet Wind Upon The Moor</p>
        </NavbarAccountSectionWrapper>
    );
}