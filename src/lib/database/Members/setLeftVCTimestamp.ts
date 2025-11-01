import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";
import { updateVCTime } from "./updateVCTime";

export async function setLeftVCTimestamp(member: GuildMember) {
    const mongo = getMongo();

    // Update to show new left VC timestamp
    await mongo.database
        .collection("guild-members")
        .findOneAndUpdate(
            { memberID: member.id, guildID: member.guild.id },
            {
                $set: { lastLeftVCTimestamp: Date.now() },
                $setOnInsert: await defaultGuildMemberData(member)
            },
            { upsert: true }
        );

    // Update VC time
    await updateVCTime(member);
}