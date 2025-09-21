import { getMongo } from "@/lib/mongo";
import { defaultGuildMemberData } from "@/MarbleFoxxo/lib/defaultGuildMemberData";
import { GuildMember } from "discord.js";
import { Actions } from "../Actions";

const func = {
    async updateVCTime(member: GuildMember) {
        const mongo = getMongo();

        const guildMemberData = await mongo.database
            .collection("guild-members")
            .findOne({ memberID: member.id, guildID: member.guild.id });

        if (!guildMemberData) {
            await Actions.addGuildMember(member);

            return;
        }

        const lastJoinedVC = guildMemberData.lastJoinedVCTimestamp ?? null;
        const lastLeftVC = guildMemberData.lastLeftVCTimestamp ?? null;

        if (!lastJoinedVC || !lastLeftVC) return;

        const elapsedTime = lastLeftVC - lastJoinedVC;

        // Update total VC time
        await mongo.database
            .collection("guild-members")
            .findOneAndUpdate(
                { memberID: member.id, guildID: member.guild.id },
                {
                    $inc: { vcTotalTime: elapsedTime },
                    $setOnInsert: defaultGuildMemberData(member!)
                },
                { upsert: true }
            );

        // Update VC longest session if necessary
        if (elapsedTime > guildMemberData.vcLongestSession) {
            await Actions.setLongestVCSession(member, elapsedTime);
        }
    }
};

export default func;