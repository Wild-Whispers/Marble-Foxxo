import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async incrementTotalMembers(guild: Guild) {
        const mongo = getMongo();

        await mongo.database
            .collection("guilds")
            .findOneAndUpdate(
                { guildID: guild.id },
                {
                    $inc: { totalMembers: 1 },
                },
                { upsert: true }
            );
    }
};

export default func;