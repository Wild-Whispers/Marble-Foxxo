import { ReactNode } from "react";
import "./globals.css";

export default async function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="bg-stone-950 text-stone-50">
            <head>
                <meta charSet="UTF-8" />
                <link rel="shortcut icon" href="/assets/rbtechteamlogo.png" type="image/x-icon"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>The Marble Grove</title>
            </head>
            <body className="
                flex
                flex-row
                w-full
                min-h-screen

                bg-[url('/assets/backgrounds/carbon_fibre.webp')]
            ">
                {children}
            </body>
        </html>
    );
}