import { getMongo } from "@/lib/mongo";
import { Message } from "discord.js";

const func = {
    async incrementMessageCount(message: Message) {
        const mongo = getMongo();

        const member = message.member!;
        const user = await member.user;

        // Define shards per message
        const shardsPerMessage = 2;

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: message.member?.id, guildID: message.guildId },
                [
                    {
                        $set: {
                        // always increment msgsSent
                        msgsSent: { $add: ["$msgsSent", 1] },

                        // if totalShards exists, increment it
                        // else seed it with 50 and then add increment
                        totalShards: {
                            $add: [
                            { $ifNull: ["$totalShards", 50] },
                            shardsPerMessage
                            ]
                        },

                        avatar: { $ifNull: ["$avatar", user.displayAvatarURL()] },
                        avatarDecor: { $ifNull: ["$avatarDecor", member.avatarDecorationURL()] },
                        banner: { $ifNull: ["$banner", user.bannerURL()] },
                        },
                    },
                ],
                { upsert: true }
            );
    }
};

export default func;