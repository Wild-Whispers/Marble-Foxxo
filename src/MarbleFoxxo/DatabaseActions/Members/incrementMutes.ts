import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async incrementMutes(member: GuildMember) {
        const mongo = getMongo();

        return await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $inc: {
                        timesMuted: 1
                    },
                    $setOnInsert: {
                        ...await defaultGuildMemberData(member),
                        avatar: member.user.displayAvatarURL(),
                        avatarDecor: member.avatarDecorationURL(),
                        banner: member.user.bannerURL()
                    }
                },
                { upsert: true, returnDocument: "after" }
            );
    }
};

export default func;