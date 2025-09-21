import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { Actions } from "../Actions";
import { GuildMember } from "discord.js";

const func = {
    async setLeftVCTimestamp(member: GuildMember) {
        const mongo = getMongo();

        // Update to show new left VC timestamp
        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $set: { lastLeftVCTimestamp: Date.now() },
                    $setOnInsert: await defaultGuildMemberData(member)
                },
                { upsert: true }
            );

        // Update VC time
        await Actions.updateVCTime(member);
    }
};

export default func;