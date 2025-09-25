import { LevelRoles } from "@/_Interfaces/LevelRoles";
import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async pushLvlRole(guild: Guild, levelRole: LevelRoles) {
        const mongo = getMongo();

        const levelRoleData = await mongo.database
            .collection("lvl-roles")
            .findOneAndUpdate(
                { guildID: guild.id },
                {
                    $set: {
                        guildID: guild.id,
                        [`lvlRoles.${levelRole.lvl}`]: levelRole
                    }
                },
                { upsert: true, returnDocument: "after" }
            );

        return levelRoleData;
    }
};

export default func;