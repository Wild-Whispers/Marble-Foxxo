import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setMemberLeaveLogChannel(guild: Guild, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guild.id },
            {
                $set: { memberLeaveLogs: channelID },
            },
            { upsert: true }
        );
}