import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

export async function setLongestVCSession(member: GuildMember, elapsedSessionTime: number) {
    const mongo = getMongo();

    await mongo.database
        .collection("guild-members")
        .findOneAndUpdate(
            { memberID: member.id, guildID: member.guild.id },
            {
                $set: { vcLongestSession: elapsedSessionTime },
                $setOnInsert: await defaultGuildMemberData(member)
            },
            { upsert: true }
        );
}