import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async incrementReports(guild: Guild) {
        const mongo = getMongo();

        return await mongo.database
            .collection("guilds")
            .findOneAndUpdate(
                { guildID: guild.id },
                {
                    $inc: { reportsCount: 1 },
                },
                { upsert: true, returnDocument: "after" }
            );
    }
};

export default func;