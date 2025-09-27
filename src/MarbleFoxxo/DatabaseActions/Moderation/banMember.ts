import { ModerationActions } from "@/_Enums/ModerationActions";
import { getMongo } from "@/lib/mongo";
import { GuildMember } from "discord.js";
import { Actions } from "../Actions";

const func = {
    async banMember(member: GuildMember, reason?: string) {
        const mongo = getMongo();

        await mongo.database
            .collection("mod-action-logs")
            .insertOne({
                userID: member.user.id,
                guildID: member.guild.id,
                type: ModerationActions.BAN,
                reason: reason ?? "No reason given"
            });

        return await Actions.incrementBans(member);
    }
};

export default func;