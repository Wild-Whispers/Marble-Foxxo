import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";
import { Actions } from "../Actions";

const func = {
    async fetchGuildMember(member: GuildMember) {
        const mongo = getMongo();

        const data = await mongo.database
            .collection("guild-members")
            .findOne({ memberID: member.id, guildID: member.guild.id });

        if (!data) {
            await Actions.addGuildMember(member);

            const data = await mongo.database
                .collection("guild-members")
                .findOne({ memberID: member.id, guildID: member.guild.id });

            return data;
        }

        if (!data.totalShards) {
            await mongo.database
                .collection("guild-members")
                .updateOne(
                    { memberID: member.id, guildID: member.guild.id },
                    { $set: { totalShards: 50 } }
                );

            const data = await mongo.database
                .collection("guild-members")
                .findOne({ memberID: member.id, guildID: member.guild.id });

            return data;
        }

        return data;
    }
};

export default func;