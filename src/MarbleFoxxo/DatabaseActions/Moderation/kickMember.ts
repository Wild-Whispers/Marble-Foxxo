import { ModerationActions } from "@/_Enums/ModerationActions";
import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";
import { Actions } from "../Actions";

const func = {
    async kickMember(member: GuildMember, reason?: string) {
        const mongo = getMongo();

        await mongo.database
            .collection("mod-action-logs")
            .insertOne({
                userID: member.user.id,
                guildID: member.guild.id,
                type: ModerationActions.KICK,
                durationInSeconds: "N/A",
                reason: reason ?? "No reason given"
            });

        return await Actions.incrementKicks(member);
    }
};

export default func;