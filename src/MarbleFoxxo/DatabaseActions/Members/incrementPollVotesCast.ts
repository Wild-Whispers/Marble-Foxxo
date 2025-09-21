import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Guild, GuildMember } from "discord.js";

const func = {
    async incrementPollVotesCast(guild: Guild, member: GuildMember) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: guild.id },
                {
                    $inc: { pollVotesCast: 1 },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );
    }
};

export default func;