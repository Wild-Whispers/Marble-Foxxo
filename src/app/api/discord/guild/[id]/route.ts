import { DiscordFetchGuild } from "@/lib/discord/FetchGuild";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Record<string, string> }) {
    const { id } = await params;

    try {
        // Fetch the guild from DB
        const { message, data } = await DiscordFetchGuild(id);
        if (!data || message) return NextResponse.json(
            {
                error: "Error fetching guild: " + message
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