import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Message } from "discord.js";

export async function incrementAttachmentsShared(message: Message) {
    const mongo = getMongo();

    const attachmentsCount = message.attachments.size;

    await mongo.database
        .collection("guild-members")
        .findOneAndUpdate(
            { memberID: message.member?.id, guildID: message.guildId },
            {
                $inc: { attachmentsShared: attachmentsCount },
                $setOnInsert: await defaultGuildMemberData(message.member!)
            },
            { upsert: true }
        );
}