import { FetchDiscordAvatarURL } from "@/_Helpers/FetchDiscordAvatarURL";
import { FetchDiscordBannerURL } from "@/_Helpers/FetchDiscordBannerURL";
import Col from "@/components/Col";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import Row from "@/components/Row";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Dashboard() {
    const cookieStore = await cookies();
    const userDataRaw = cookieStore.get("discord_user")?.value;

    try {
        // Try to parse user data
        if (!userDataRaw) throw new Error("No user found!");

        const userData = JSON.parse(userDataRaw);

        if (process.env.NODE_ENV === "development") console.log(userData);

        // User data
        const avatarHash = userData.avatar;
        const bannerHash = userData.banner;
        const avatar = await FetchDiscordAvatarURL(userData.id, avatarHash);
        const banner = await FetchDiscordBannerURL(userData.id, bannerHash);

        return (
            <Col classes="gap-2">

                <Col classes="relative p-2 w-full h-50">
                    {
                        banner && <Image priority src={banner} alt={`${userData.username}'s Banner`} fill className="object-cover rounded-md" />
                    }

                    <Row classes="
                        absolute
                        justify-start
                        items-center
                        gap-2
                    ">
                        <Image src={avatar} alt={`${userData.username}'s Avatar`} width={35} height={35} className="rounded-full" />
                        <h1 className="text-2xl font-semibold">{userData.global_name}</h1>
                    </Row>
                </Col>

                <Col>
                    <p className="text-xs text-white/50">id: {userData.id}</p>
                    <p className="text-xs text-white/50">Discriminator: {userData.username}</p>
                </Col>

                <p className="text-md">Welcome, {userData.global_name}! To add our bot to one of your servers, please use the link below:</p>
                <Link href="https://discord.com/oauth2/authorize?client_id=1390546028226412544&permissions=2840998996344823&integration_type=0&scope=bot" className="text-sm underline">https://discord.com/oauth2/authorize?client_id=1390546028226412544&permissions=2840998996344823&integration_type=0&scope=bot</Link>
    
            </Col>
        );
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        return <ErrorMessage title=":(" description={error.toString()} />;
    }
}