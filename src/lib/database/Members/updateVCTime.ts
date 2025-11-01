import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";
import { addGuildMember } from "./addGuildMember";
import { incrementGuildTotalVCTime } from "../Guilds/incrementGuildTotalVCTime";
import { setLongestVCSession } from "./setLongestVCSession";

export async function updateVCTime(member: GuildMember) {
    const mongo = getMongo();

    const guildMemberData = await mongo.database
        .collection("guild-members")
        .findOne({ memberID: member.id, guildID: member.guild.id });

    if (!guildMemberData) {
        await addGuildMember(member);

        return;
    }

    const lastJoinedVC = guildMemberData.lastJoinedVCTimestamp ?? null;
    const lastLeftVC = guildMemberData.lastLeftVCTimestamp ?? null;

    if (!lastJoinedVC || !lastLeftVC) return;

    const elapsedTime = lastLeftVC - lastJoinedVC;

    // Update total VC time for the member
    await mongo.database
        .collection("guild-members")
        .findOneAndUpdate(
            { memberID: member.id, guildID: member.guild.id },
            {
                $inc: { vcTotalTime: elapsedTime },
                $setOnInsert: await defaultGuildMemberData(member!)
            },
            { upsert: true }
        );

    // Update total VC time for the guild
    await incrementGuildTotalVCTime(member, elapsedTime);

    // Update VC longest session if necessary
    if (elapsedTime > guildMemberData.vcLongestSession) {
        await setLongestVCSession(member, elapsedTime);
    }
}