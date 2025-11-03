import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const res = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        const error = await res.text();
        return NextResponse.json({ error: `Discord API error: ${error}` }, { status: 400 });
    }

    return NextResponse.json({ data: await res.json() });
}