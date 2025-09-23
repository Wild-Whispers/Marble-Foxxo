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
                {
                    $setOnInsert: await defaultGuildMemberData(member),
                    $set: {
                        avatar: member.user.displayAvatarURL(),
                        avatarDecor: member.avatarDecorationURL(),
                        banner: member.user.bannerURL(),
                    }
                },
                {
                    upsert: true,
                    returnDocument: "after"
                }
            );
    }
};

export default func;