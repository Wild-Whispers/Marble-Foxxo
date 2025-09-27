import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async decrementTotalMembers(guild: Guild) {
        const mongo = getMongo();

        return await mongo.database
            .collection("guilds")
            .findOneAndUpdate(
                { guildID: guild.id },
                {
                    $inc: { totalMembers: -1 },
                },
                { upsert: true, returnDocument: "after" }
            );
    }
};

export default func;