import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Message } from "discord.js";

const func = {
    async incrementEditedMessages(message: Message) {
        const mongo = getMongo();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: message.member?.id, guildID: message.guildId },
                {
                    $inc: { msgsEdited: 1 },
                    $setOnInsert: await defaultGuildMemberData(message.member!)
                },
                { upsert: true }
            );
    }
};

export default func;