import { getMongo } from "@/lib/mongo";
import { Message } from "discord.js";

const func = {
    async incrementMessageCount(message: Message) {
        const mongo = getMongo();

        const member = message.member!;
        const user = await member.user;

        // Define shards per message
        const defaultShardsPerMessage = 2;
        const shardsPer1000Chars = 5;

        // Get message content
        const content = message.content;

        let shardsToAward = defaultShardsPerMessage;
        if (content && content.length > 0) {
            const len = content.length;

            if (len > 100 && len < 1000) shardsToAward = 3;
            if (len >= 1000 && len < 2000) shardsToAward = shardsPer1000Chars;
            if (len >= 2000 && len < 3000) shardsToAward = shardsPer1000Chars * 2;
            if (len >= 3000 && len < 4000) shardsToAward = shardsPer1000Chars * 3;
            if (len >= 4000) shardsToAward = shardsPer1000Chars * 4; // Nitro limit
        }


        const memberData = await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: message.member?.id, guildID: message.guildId },
                [
                    {
                        $set: {
                        // Always increment msgsSent
                        msgsSent: { $add: [ { $ifNull: ["$msgsSent", 0] }, 1 ] },

                        // If totalShards exists, increment it
                        // Else seed it with 50 and then add increment
                        totalShards: {
                            $add: [
                                { $ifNull: ["$totalShards", 50] },
                                shardsToAward
                            ]
                        },

                        avatar: { $ifNull: ["$avatar", user.displayAvatarURL()] },
                        avatarDecor: { $ifNull: ["$avatarDecor", member.avatarDecorationURL()] },
                        banner: { $ifNull: ["$banner", user.bannerURL()] },
                        },
                    },
                ],
                { upsert: true, returnDocument: "after" }
            );

        return memberData;
    }
};

export default func;