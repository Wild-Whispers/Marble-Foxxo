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
                    $set: { active: true }, // Always do this

                    $setOnInsert: { // Only do this if the doc doesn't exist already
                        guildID: guild.id,
                        permittedToVerify: [],
                        nsfwRole: "",
                        accessRole: "",
                        moderationLogChannel: null
                    }
                },
                { upsert: true }
            );
    }
};

export default func;