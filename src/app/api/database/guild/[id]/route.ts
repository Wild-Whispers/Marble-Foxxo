import { fetchGuildByID } from "@/lib/database/Guilds/fetchGuildByID";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;

    try {
        // Fetch the guild from DB
        const guild = await fetchGuildByID(id);
        if (!guild) return NextResponse.json(
            {
                error: "Guild not found!"
            },
            {
                status: 404
            }
        );

        return NextResponse.json({ data: guild });
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