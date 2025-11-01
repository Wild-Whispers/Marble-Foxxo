import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

export async function setMemberLeaveLogChannel(guild: Guild, channelID: string): Promise<void>;
export async function setMemberLeaveLogChannel(guild: string, channelID: string): Promise<void>;

export async function setMemberLeaveLogChannel(guild: Guild | string, channelID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: typeof guild === "string" ? guild : guild.id },
            {
                $set: { memberLeaveLogs: channelID },
            },
            { upsert: true }
        );
}