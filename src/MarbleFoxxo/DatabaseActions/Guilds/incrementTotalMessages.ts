import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async incrementTotalMessages(guild: Guild) {
        const mongo = getMongo();

        await mongo.database
            .collection("guilds")
            .findOneAndUpdate(
                { guildID: guild.id },
                {
                    $inc: { totalMessages: 1 },
                },
                { upsert: true }
            );
    }
};

export default func;