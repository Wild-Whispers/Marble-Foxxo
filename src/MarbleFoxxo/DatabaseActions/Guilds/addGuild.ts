import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async addGuild(guild: Guild) {
        const mongo = getMongo();

        await mongo.database
            .collection("guilds")
            .updateOne(
                { guildID: guild.id },
                {
                    $set: { active: true },

                    $setOnInsert: { // Only do this if the doc doesn't exist already
                        guildID: guild.id,
                        permittedToVerify: [],
                        nsfwRole: "",
                        accessRole: "",
                        moderationLogChannel: null,
                        totalMessages: 0,
                        vcTotalTime: 0
                    }
                },
                { upsert: true }
            );
    }
};

export default func;