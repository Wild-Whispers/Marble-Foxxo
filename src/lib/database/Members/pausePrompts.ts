import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

export async function pausePrompts(member: GuildMember) {
    const mongo = getMongo();

    const oneHour = 60 * 60 * 1000;
    const oneDay = oneHour * 24;
    const pauseTimeInMilliseconds = oneDay;
    const promptsPausedUntil = Date.now() + pauseTimeInMilliseconds;

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