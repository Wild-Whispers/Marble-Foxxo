import { defaultGuildMemberData } from "@/DiscordBot/lib/defaultGuildMemberData";
import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";

export async function addGuildMember(member: GuildMember) {
    const mongo = getMongo();

    const user = await member.user.fetch();

    await mongo.database
        .collection("guild-members")
        .insertOne({
            ...await defaultGuildMemberData(member),
            avatar: member.user.displayAvatarURL(),
            avatarDecor: member.avatarDecorationURL(),
            banner: user.bannerURL(),
            totalShards: 50
        });
}