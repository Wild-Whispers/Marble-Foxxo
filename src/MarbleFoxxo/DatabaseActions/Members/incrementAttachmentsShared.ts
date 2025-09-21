import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Message } from "discord.js";

const func = {
    async incrementAttachmentsShared(message: Message) {
        const mongo = getMongo();

        const attachmentsCount = message.attachments.size;

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: message.member?.id, guildID: message.guildId },
                {
                    $inc: { attachmentsShared: attachmentsCount },
                    $setOnInsert: defaultGuildMemberData(message.member!)
                },
                { upsert: true }
            );
    }
};

export default func;