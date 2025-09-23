import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Message } from "discord.js";

const func = {
    async incrementMessageCount(message: Message) {
        const mongo = getMongo();

        const member = message.member!;
        const user = await member.user;

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: message.member?.id, guildID: message.guildId },
                {
                    $inc: { msgsSent: 1 },
                    $setOnInsert: {
                        ...await defaultGuildMemberData(member),
                        avatar: member.user.displayAvatarURL(),
                        avatarDecor: member.avatarDecorationURL(),
                        banner: user.bannerURL(),
                        totalShards: 50
                    }
                },
                { upsert: true }
            );
    }
};

export default func;