import { CanUserManageGuild } from "@/_Helpers/CanUserManageGuild";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Record<string, string> }) {
    const { guildID } = await params;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://marblefoxxo.wildwhispers.xyz";
    const res = await fetch(`${baseURL}/api/discord/user/fetch`,{
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const json = await res.json();

    if (json.error) return NextResponse.json( { error: "Discord API Error: Could not fetch user" }, { status: 500 });

    try {
        const data = await CanUserManageGuild(json.data, guildID);

        return NextResponse.json({ data });
    }   catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error(error);

        return NextResponse.json( { error: "Internal server error: " + error }, { status: 500 });
    }
}