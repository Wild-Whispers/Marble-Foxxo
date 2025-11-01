import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "15mb"
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
                pathname: "/cdn/images/**",
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
