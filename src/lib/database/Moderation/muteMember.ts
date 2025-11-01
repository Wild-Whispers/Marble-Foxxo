import { ModerationActions } from "@/_Enums/ModerationActions";
import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";
import { incrementMutes } from "../Members/incrementMutes";

export async function muteMember(member: GuildMember, duration: number, reason?: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("mod-action-logs")
        .insertOne({
            userID: member.user.id,
            guildID: member.guild.id,
            type: ModerationActions.MUTE,
            durationInSeconds: duration,
            reason: reason ?? "No reason given"
        });

    return await incrementMutes(member);
}