import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";

const func = {
    async fetchGuildMember(member: GuildMember) {
        const mongo = getMongo();

        return await mongo.database
            .collection("guild-members")
            .findOne({ memberID: member.id, guildID: member.guild.id });
    }
};

export default func;