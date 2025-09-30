import { GuildReport } from "@/_Interfaces/GuildReport";
import { getMongo } from "@/lib/mongo";
import { Guild, PrivateThreadChannel, PublicThreadChannel } from "discord.js";

const func = {
    async fetchGuildReport(guild: Guild, thread: PrivateThreadChannel | PublicThreadChannel<false>) {
        const mongo = getMongo();

        return await mongo.database
            .collection<GuildReport>("guild-reports")
            .findOne({ guildID: guild.id, threadID: thread.id });
    }
};

export default func;