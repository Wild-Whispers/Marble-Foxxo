import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setMemberJoinLogChannel(guild: Guild, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guild.id },
            {
                $set: { memberJoinLogs: channelID },
            },
            { upsert: true }
        );
}