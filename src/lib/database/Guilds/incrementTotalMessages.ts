import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function incrementTotalMessages(guild: Guild) {
    const mongo = getMongo();

    return await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guild.id },
            {
                $inc: { totalMessages: 1 },
            },
            { upsert: true, returnDocument: "after" }
        );
}