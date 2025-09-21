import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async setJoinedVCTimestamp(member: GuildMember) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $set: { lastJoinedVCTimestamp: Date.now() },
                    $inc: { vcJoins: 1 },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );
    }
};

export default func;