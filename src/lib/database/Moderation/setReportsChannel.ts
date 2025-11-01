import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setReportChannel(guild: Guild, channelID: string): Promise<void>;
export async function setReportChannel(guild: string, channelID: string): Promise<void>;

export async function setReportChannel(guild: Guild | string, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: typeof guild === "string" ? guild : guild.id },
            {
                $set: { reportsChannel: channelID },
            },
            { upsert: true }
        );
}