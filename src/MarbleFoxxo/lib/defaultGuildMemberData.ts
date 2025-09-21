import { GuildMember } from "discord.js";

export async function defaultGuildMemberData(member: GuildMember) {
    const user = await member.user.fetch();

    /**
     * Comment-out incrementable properties as their handlers get made.
     * For example, msgsSent has "incrementMessageCount" which will automatically add this property with a default value if it doesn't exist, and if it does, it will increment it
     * But I still want a readable representation of all of the properties the guild-members document has, so just comment them out as we go
     */
    return {
        // Meta
        memberID: member.id,
        guildID: member.guild.id,
        avatar: member.user.displayAvatarURL(),
        avatarDecor: member.avatarDecorationURL(),
        banner: user.bannerURL(),
        guildJoinTimestamp: Date.now(),
        /* lastJoinedVCTimestamp: null,
        lastLeftVCTimestamp: null, */

        // Moderation
        /*timesKicked: 0,
        timesWarned: 0,
        timesMuted: 0,
        timesBanned: 0,*/

        // Fun/Stats
        /*msgsSent: 0,
        msgsEdited: 0,
        vcJoins: 0,
        vcTotalTime: 0,
        vcLongestSession: 0,
        streamingSessionsStarted: 0,
        attachmentsShared: 0,
        pollVotesCast: 0*/
    }
}