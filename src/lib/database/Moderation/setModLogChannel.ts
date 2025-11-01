import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setModLogChannel(guild: Guild, channelID: string): Promise<void>;
export async function setModLogChannel(guild: string, channelID: string): Promise<void>;

export async function setModLogChannel(guild: Guild | string, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: typeof guild === "string" ? guild : guild.id },
            {
                $set: { moderationLogChannel: channelID },
            },
            { upsert: true }
        );
}