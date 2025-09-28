import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async incrementBans(member: GuildMember) {
        const mongo = getMongo();

        return await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $inc: {
                        timesBanned: 1
                    },
                    $set: { isBanned: true },
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