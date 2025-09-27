import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import MediaEmbed from "@/MarbleFoxxo/Discord/EmbedWrappers/MediaEmbed";
import { AttachmentBuilder, Colors, GuildMember, PartialGuildMember } from "discord.js";
import path from "node:path";

export default async function MemberJoinLeave(member: GuildMember | PartialGuildMember, joinEvent: boolean) {
    if (process.env.MODE === "development") {
        if (joinEvent) {
            console.log("Guild member Joined:", member);
        } else {
            console.log("Guild member Left:", member);
        }
    }

    // Fetch log channel
    const guildData = joinEvent ? await Actions.incrementTotalMembers(member.guild) : await Actions.decrementTotalMembers(member.guild);

    if (process.env.MODE === "development") console.log("Guild Data fetched on member join/leave:", guildData);

    if (!guildData || !guildData.memberJoinLogs) return;

    // Get the channel
    const channel = await member.guild.channels.fetch(joinEvent ? guildData.memberJoinLogs : guildData.memberLeaveLogs);

    if (process.env.MODE === "development") console.log("Member join/leave channel fetched:", channel);

    if (!channel || !channel.isTextBased()) return;

    // Send log with embed
    const iconFile = new AttachmentBuilder(path.join(__dirname, "..", "the_marble_grove.png"), { name: "the_marble_grove.png" });
    let embed;
    if (joinEvent) {
        embed = await MediaEmbed(
            `Someone joined ${member.guild.name}!`,
            `Welcome, ${member}! Congrats, you are member #${guildData.totalMembers}!`,
            Colors.DarkPurple,
            `attachment://the_marble_grove.png`
        );
    } else {
         embed = await MediaEmbed(
            `Someone left ${member.guild.name} :(`,
            `${member}! There are now ${guildData.totalMembers} members.`,
            Colors.DarkOrange,
            `attachment://the_marble_grove.png`
        );
    }
    

    await channel.send({ embeds: [embed!], files: [iconFile] });
}