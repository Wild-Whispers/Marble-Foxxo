import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setMemberJoinLogChannel(guild: Guild, channelID: string): Promise<void>;
export async function setMemberJoinLogChannel(guildID: string, channelID: string): Promise<void>;

export async function setMemberJoinLogChannel(guild: Guild | string, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: typeof guild === "string" ? guild : guild.id },
            {
                $set: { memberJoinLogs: channelID },
            },
            { upsert: true }
        );
}