import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";

export async function incrementGuildTotalVCTime(member: GuildMember, elapsedSessionTime: number) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: member.guild.id },
            {
                $inc: { vcTotalTime: elapsedSessionTime },
            },
            { upsert: true }
        );
}