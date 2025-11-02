import { FetchDiscordAvatarURL } from "@/_Helpers/FetchDiscordAvatarURL";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string, avatarHash: string } }) {
    const { id, avatarHash } = await params;

    try {
        // Fetch the guild from DB
        const data = await FetchDiscordAvatarURL(id, avatarHash);

        return NextResponse.json({ data });
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error(error);

        return NextResponse.json(
            {
                error: "Internal server error: Error fetching user avatar"
            },
            {
                status: 500
            }
        );
    }
}