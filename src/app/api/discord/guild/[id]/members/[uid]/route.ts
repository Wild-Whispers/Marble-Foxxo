import { DiscordFetchGuildMember } from "@/lib/discord/FetchGuildMember";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string, uid: string }> }) {
    const { id: guildID, uid } = await params;

    try {
        // Fetch the guild from DB
        const { message, data } = await DiscordFetchGuildMember(guildID, uid);
        if (!data || message) return NextResponse.json(
            {
                error: "Error fetching guild member roles: " + message
            },
            {
                status: 404
            }
        );

        return NextResponse.json({ data });
    } catch (error: any) {  /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error(error);

        return NextResponse.json(
            {
                error: "Internal server error"
            },
            {
                status: 500
            }
        );
    }
}