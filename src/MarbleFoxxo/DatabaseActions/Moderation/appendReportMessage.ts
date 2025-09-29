import { GuildReport } from "@/_Interfaces/GuildReport";
import { getMongo } from "@/lib/mongo";
import { Guild, Message, PrivateThreadChannel, PublicThreadChannel } from "discord.js";

const func = {
    async appendReportMessage(guild: Guild, thread: PrivateThreadChannel | PublicThreadChannel<false>, message: Message) {
        const mongo = getMongo();

        return await mongo.database
            .collection<GuildReport>("guild-reports")
            .findOneAndUpdate(
                { guildID: guild.id, threadID: thread.id },
                {
                    $setOnInsert: {
                        guildID: guild.id,
                        threadID: thread.id
                    },
                    $push: { messages: message.id }
                },
                { upsert: true, returnDocument: "after" }
            );
    }
};

export default func;