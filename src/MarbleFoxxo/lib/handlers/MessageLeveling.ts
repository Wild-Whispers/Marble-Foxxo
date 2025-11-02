import { Colors, EmbedBuilder, GuildMember, Message } from "discord.js";
import isMemberEligibleForLvlUp from "../helpers/isMemberEligibleForLvlUp";
import { fetchGuildMember } from "@/lib/database/Members/fetchGuildMember";
import { pausePrompts } from "@/lib/database/Members/pausePrompts";
import { fetchLvlUpNotificationsDestination } from "@/lib/database/Guilds/fetchLvlUpNotificationsDestination";
import { LvlUpNotificationsDestinationInterface } from "@/_Interfaces/LvlUpNotificationsDestination";
import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";

export default async function MessageLeveling(message: Message) {
    if (!message || !message.content) return;

    // Don't bother if message is less than specified length
    if (message.content.length < 3) return;

    const memberData = await fetchGuildMember(message.member as GuildMember);

    if (!memberData) return;

    // Define levels
    const currentLvl = memberData.lvl ?? 0; // If `lvl` isn't set, that means they're level 0 anyway
    const totalMessages = memberData.msgsSent ?? 1; // If `totalMsgs` isn't set, that means they have no messages anyway and this would be their first
    const totalShards = memberData.totalShards ?? 50; // If `totalShards` isn't set, that means they have no messages anyway and this would be their first

    // Check if the user can level up
    const { eligible, requiredTotalMessages, requiredTotalShards } = isMemberEligibleForLvlUp(currentLvl, totalMessages, totalShards);

    // Escape if not eligible
    if (!eligible) {
        if (process.env.MODE === "development") {
            console.debug(`[${new Date().toISOString()}] [Dev Debug] User sent a message, but was not eligible to lvl up.\n Total Messages: ${totalMessages}/${requiredTotalMessages} \n Total Shards: ${totalShards}/${requiredTotalShards}`);
        }

        return;
    }

    // User is eligible, but prompting is paused for them
    if (Date.now() < memberData.promptsPausedUntil) {
        if (process.env.MODE === "development") {
            console.debug(`[${new Date().toISOString()}] [Dev Debug] User sent a message, they are eligible to lvl up, but their prompts are paused.\n Total Messages: ${totalMessages}/${requiredTotalMessages} \n Total Shards: ${totalShards}/${requiredTotalShards}`);
        }

        return;
    }

    // User is eligible, create embed
    const embed = new EmbedBuilder()
        .setColor(Colors.DarkPurple)
        .setTitle(`Congrats, ${message.member?.displayName}!`)
        .setDescription(`You are eligible to level up to Lvl.${currentLvl + 1}!`)
        .addFields([
            { name: "Run:", value: "`/lvl-up`"},
            { name: "Total Msgs:", value: `${totalMessages}/${requiredTotalMessages}`},
            { name: "Total Shards:", value: `⟠${totalShards}/⟠${requiredTotalShards}`}
        ]);

    // Fetch LvlUpNotifactionDestinations
    const LvlUpNotifactionDestinationsRaw: LvlUpNotificationsDestinationInterface = await fetchLvlUpNotificationsDestination(message.guildId!);
    const lvlUpSetting = LvlUpNotifactionDestinationsRaw.setting;
    const lvlUpChannelID = LvlUpNotifactionDestinationsRaw.channelID;

    if (lvlUpSetting === LvlUpNotifactionDestinations.DEFINED_CHANNEL) {
        // Modify embed description to mention user
        embed.setDescription(`Congrats, ${message.member}! You are eligible to level up to Lvl.${currentLvl + 1}!`);

        // Fetch the channel
        const channel = await message.guild?.channels.fetch(lvlUpChannelID!);

        // Check channel exists & is text based
        if (channel && channel.isTextBased()) channel.send({ embeds: [embed]});
        else console.warn(`[${new Date().toISOString()}] [Embed Error] A lvl-up embed was attempted to be sent to channel with id '${lvlUpChannelID}', but the specified channel is not text-based. This should not happen, and is a bug.`);
    } else if (lvlUpSetting === LvlUpNotifactionDestinations.RELATIVE_CHANNEL) {
        // Send embed as-is to the message's channel
        await message.reply({ embeds: [embed] });
    }

    // Don't bug the user repeatedly. Wait a while.
    await pausePrompts(message.member as GuildMember);
}