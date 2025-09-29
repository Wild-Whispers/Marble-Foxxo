import { getMongo } from "@/lib/mongo";
import { Guild } from "discord.js";

const func = {
    async setReportChannel(guild: Guild, channelID: string) {
        const mongo = getMongo();

        await mongo.database
            .collection("guilds")
            .findOneAndUpdate(
                { guildID: guild.id },
                {
                    $set: { reportsChannel: channelID },
                },
                { upsert: true }
            );
    }
};

export default func;