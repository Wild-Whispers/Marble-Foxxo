import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async fetchAllLvlRoles(guild: Guild) {
        const mongo = getMongo();

        const doc = await mongo.database
            .collection("lvl-roles")
            .findOne({ guildID: guild.id });

        return doc?.lvlRoles ?? null;
    }
};

export default func;