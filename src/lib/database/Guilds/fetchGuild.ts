import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function fetchGuild(guild: Guild) {
    const mongo = getMongo();

    return await mongo.database
        .collection("guilds")
        .findOne({ guildID: guild.id });
}