import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";

const func = {
    async incrementGuildTotalVCTime(member: GuildMember, elapsedSessionTime: number) {
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
};

export default func;