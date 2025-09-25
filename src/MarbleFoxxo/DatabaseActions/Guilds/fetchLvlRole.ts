import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async fetchLvlRole(guild: Guild, lvl: number) {
        const mongo = getMongo();

        const doc = await mongo.database
            .collection("lvl-roles")
            .findOne(
                { guildID: guild.id, [`lvlRoles.${lvl}`]: { $exists: true } },
                { projection: { [`lvlRoles.${lvl}`]: 1 } }
            );

        return doc?.lvlRoles?.[lvl] ?? null;
    }
};

export default func;