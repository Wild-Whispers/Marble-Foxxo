import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function removeGuild(guild: Guild) {
    const mongo = getMongo();
    
    await mongo.database
        .collection("guilds")
        .updateOne(
            { guildID: guild.id },
            {
                $set: { active: false }
            },
            { upsert: false }
        );
}