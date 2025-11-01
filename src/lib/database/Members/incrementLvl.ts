import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

export async function incrementLvl(member: GuildMember, shardsRequired: number) {
    const mongo = getMongo();

    return await mongo.database
        .collection("guild-members")
        .findOneAndUpdate(
            { memberID: member.id, guildID: member.guild.id },
            {
                $inc: {
                    lvl: 1,
                    totalShards: shardsRequired
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