import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { Colors, EmbedBuilder, Message } from "discord.js";
import isMemberEligibleForLvlUp from "../helpers/isMemberEligibleForLvlUp";

export default async function MessageLeveling(message: Message) {
    if (!message || !message.content) return;

    // Don't bother if message is less than specified length
    if (message.content.length < 3) return;

    const memberData = await Actions.fetchGuildMember(message.member);

    if (!memberData) return;

    // Define levels
    const currentLvl = memberData.lvl ?? 0; // If `lvl` isn't set, that means they're level 0 anyway
    const totalMessages = memberData.totalMessages ?? 1; // If `totalMsgs` isn't set, that means they have no messages anyway and this would be their first
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
                { name: "Run:", value: "`/lvlup`"},
                { name: "Total Msgs:", value: `${totalMessages}/${requiredTotalMessages}`},
                { name: "Total Shards:", value: `${totalShards}/${requiredTotalShards}`}
            ]);

    await message.reply({ embeds: [embed] });

    // Don't bug the user repeatedly. Wait a while.
    await Actions.pausePrompts(message.member);
}