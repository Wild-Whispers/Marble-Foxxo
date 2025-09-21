import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Guild, GuildMember } from "discord.js";

const func = {
    async incrementStreamingSessionsStarted(guild: Guild, member: GuildMember) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: guild.id },
                {
                    $inc: { streamingSessionsStarted: 1 },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );
    }
};

export default func;