import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";

const func = {
    async fetchGuildMember(member: GuildMember) {
        const mongo = getMongo();

        return await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                [
                    {
                        $set: {
                            avatar: member.user.displayAvatarURL(),
                            avatarDecor: member.avatarDecorationURL(),
                            banner: member.user.bannerURL(),

                            // If totalShards is missing, set it to 50
                            totalShards: { $ifNull: ["$totalShards", 50] },

                            // spread your defaults only if it's a new doc
                            ...await defaultGuildMemberData(member)
                        }
                    }
                ],
                {
                    upsert: true,
                    returnDocument: "after"
                }
            );
    }
};

export default func;