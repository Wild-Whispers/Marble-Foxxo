"use server";

import { setMemberJoinLogChannel } from "@/lib/database/Moderation/setMemberJoinLogChannel";
import { setMemberLeaveLogChannel } from "@/lib/database/Moderation/setMemberLeaveLogChannel";
import { setModLogChannel } from "@/lib/database/Moderation/setModLogChannel";
import { setReportChannel } from "@/lib/database/Moderation/setReportsChannel";

export interface ActionUpdateChannelsReturn {
    success: boolean,
    message?: string,
    memberJoinChannel: string,
    memberLeaveChannel: string,
    modLogChannel: string,
    reportsChannel: string
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function ActionUpdateChannels(prevState: any, data: FormData): Promise<ActionUpdateChannelsReturn> {
    const guildID = data.get("guild-id") as string;
    const memberJoinChannel = data.get("memberJoinChannel") as string;
    const memberLeaveChannel = data.get("memberLeaveChannel") as string;
    const modLogChannel = data.get("modLogChannel") as string;
    const reportsChannel = data.get("reportsChannel") as string;

    try {
        // Update channels
        await setMemberJoinLogChannel(guildID, memberJoinChannel);
        await setMemberLeaveLogChannel(guildID, memberLeaveChannel);
        await setModLogChannel(guildID, modLogChannel);
        await setReportChannel(guildID, reportsChannel);

        // Return
        return {
            success: true,
            memberJoinChannel,
            memberLeaveChannel,
            modLogChannel,
            reportsChannel
        };
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error("Error updating channels:", error);

        return {
            success: false,
            message: "Error updating channels: " + error,
            memberJoinChannel,
            memberLeaveChannel,
            modLogChannel,
            reportsChannel
        };
    }
}