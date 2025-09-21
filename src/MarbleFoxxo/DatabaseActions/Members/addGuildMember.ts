import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async addGuildMember(member: GuildMember) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .insertOne(await defaultGuildMemberData(member));
    }
};

export default func;