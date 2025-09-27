import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async setMemberJoinLogChannel(guild: Guild, channelID: string) {
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
};

export default func;