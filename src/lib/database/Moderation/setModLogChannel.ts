import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setModLogChannel(guild: Guild, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guild.id },
            {
                $set: { moderationLogChannel: channelID },
            },
            { upsert: true }
        );
}