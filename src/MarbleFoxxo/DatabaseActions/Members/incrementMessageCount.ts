import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Message } from "discord.js";

const func = {
    async incrementMessageCount(message: Message) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: message.member?.id, guildID: message.guildId },
                {
                    $inc: { msgsSent: 1 },
                    $setOnInsert: defaultGuildMemberData(message.member!)
                },
                { upsert: true }
            );
    }
};

export default func;