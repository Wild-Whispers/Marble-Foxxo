import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async pausePrompts(member: GuildMember) {
        const mongo = getMongo();

        const pauseTimeInMilliseconds = 10 * 60 * 1000; // 10 minutes
        const promptsPausedUntil = Date.now() + pauseTimeInMilliseconds;

        //console.log(member.id, member.guild.id)

        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $set: {
                        avatar: member.user.displayAvatarURL(),
                        avatarDecor: member.avatarDecorationURL(),
                        banner: member.user.bannerURL(),
                        promptsPausedUntil: promptsPausedUntil
                    },
                    $setOnInsert: {
                        ...await defaultGuildMemberData(member),
                        totalShards: 50
                    }
                },
                { upsert: true }
            );
    }
};

export default func;