import { FetchDiscordAvatarURL } from "@/_Helpers/FetchDiscordAvatarURL";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string, avatarHash: string } }) {
    const { id, avatarHash } = await context.params;

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