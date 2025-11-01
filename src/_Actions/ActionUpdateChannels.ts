"use server";

import { setMemberJoinLogChannel } from "@/lib/database/Moderation/setMemberJoinLogChannel";
import { setMemberLeaveLogChannel } from "@/lib/database/Moderation/setMemberLeaveLogChannel";
import { setModLogChannel } from "@/lib/database/Moderation/setModLogChannel";
import { setReportChannel } from "@/lib/database/Moderation/setReportsChannel";

export async function ActionUpdateChannels(data: FormData) {
    const guildID = data.get("guild-id") as string;
    const memberJoinChannel = data.get("member-join-channel") as string;
    const memberLeaveChannel = data.get("member-leave-channel") as string;
    const modLogChannel = data.get("moderation-log-channel") as string;
    const reportsChannel = data.get("reports-channel") as string;

    // Update channels
    await setMemberJoinLogChannel(guildID, memberJoinChannel);
    await setMemberLeaveLogChannel(guildID, memberLeaveChannel);
    await setModLogChannel(guildID, modLogChannel);
    await setReportChannel(guildID, reportsChannel);
}