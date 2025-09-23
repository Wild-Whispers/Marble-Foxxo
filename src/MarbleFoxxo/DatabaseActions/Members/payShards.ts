import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";

const func = {
    async payShards(member: GuildMember, recipient: GuildMember, shardsToPay: number) {
        const mongo = getMongo();

        // Decrement from member
        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $inc: { totalShards: -shardsToPay },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );

        // Increment from member
        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: recipient.id, guildID: recipient.guild.id },
                {
                    $inc: { totalShards: shardsToPay },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );
    }
};

export default func;