import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async incrementShards(member: GuildMember, shardsToAdd: number) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $inc: { totalShards: shardsToAdd },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );
    }
};

export default func;