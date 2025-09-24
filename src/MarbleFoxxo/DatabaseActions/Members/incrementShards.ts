import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async incrementShards(member: GuildMember, shardsToAdd: number) {
        const mongo = getMongo();

        const user = await member.user.fetch();

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                [
                    {
                        $set: {
                        totalShards: {
                            $add: [
                            { $ifNull: ["$totalShards", 50] }, // if missing, treat as 50
                            shardsToAdd
                            ]
                        },
                        // copy over other fields only on insert
                        ...await defaultGuildMemberData(member),
                        avatar: member.user.displayAvatarURL(),
                        avatarDecor: member.avatarDecorationURL(),
                        banner: user.bannerURL()
                        }
                    }
                ],
                { upsert: true }
            );
    }
};

export default func;