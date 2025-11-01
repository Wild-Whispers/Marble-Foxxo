import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json(
            {
                error: "Missing ?code param"
            },
            {
                status: 400
            }
        );
    }

    try {
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.MARBLE_FOXXO_CLIENT!,
                client_secret: process.env.MARBLE_FOXXO_SECRET!,
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.NODE_ENV === "development" ? "http://localhost:3000/api/auth/callback" : "https://marblefoxxo.wildwhispers.xyz/api/auth/callback",
            }),
        });

        const tokenData = await tokenRes.json();

        if (process.env.NODE_ENV === "development") console.log("Discord Response:", tokenData);

        if (!tokenRes.ok) {
            console.error("Discord token exchange failed:", tokenData);

            return NextResponse.json(
                {
                    error: "Token exchange failed"
                },
                {
                    status: 500
                }
            );
        }

        // Get the access token from Discord
        const accessToken = tokenData.access_token;

        // Fetch user info
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData = await userRes.json();

        if (process.env.NODE_ENV === "development") console.log("User Data:", userData);

        // Store access token & user
        const response = NextResponse.redirect(new URL("/dashboard", req.url));

        response.cookies.set("discord_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 3600, // 1 hour
            path: "/",
        });

        response.cookies.set("discord_user", JSON.stringify(userData), {
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            maxAge: 3600,
            path: "/",
        });

        return response;
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error("OAuth callback error:", error);

        return NextResponse.json(
            {
                error: "Internal error"
            },
            {
                status: 500
            }
        );
    }
}