import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import isMemberEligibleForLvlUp from "@/MarbleFoxxo/lib/helpers/isMemberEligibleForLvlUp";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";

const name = "lvl-up";
const description = "Level up!";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const member = await interaction.guild?.members.fetch(interaction.user.id);

        let memberData = await Actions.fetchGuildMember(member);

        if (!memberData) return;

        // Define levels
        const currentLvl = memberData.lvl ?? 0; // If `lvl` isn't set, that means they're level 0 anyway
        const totalMessages = memberData.msgsSent ?? 1; // If `totalMsgs` isn't set, that means they have no messages anyway and this would be their first
        const totalShards = memberData.totalShards ?? 50; // If `totalShards` isn't set, that means they have no messages anyway and this would be their first

        // Check if the user can level up
        const { eligible, requiredTotalMessages, requiredTotalShards } = isMemberEligibleForLvlUp(currentLvl, totalMessages, totalShards);

        // Escape if not eligible
        if (!eligible) {
            // User is eligible, create embed
            const error = await ErrorEmbed(
                "Uh-oh!",
                "You aren't eligible to level up!",
                [
                    { name: `Messages:`, value: `Required: ${requiredTotalMessages} / Current: ${totalMessages}` },
                    { name: "Shards:", value: `Required: ⟠${requiredTotalShards} / Current: ⟠${totalShards}` }
                ]
            );
        
            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Increment user lvl
        memberData = await Actions.incrementLvl(member, -requiredTotalShards);

        if (!memberData) return;

        const newCurrentLvl = memberData.lvl;
        const newTotalMessages = memberData.msgsSent;
        const newTotalShards = memberData.totalShards

        // Calculate requirements for next level
        const { eligible: nextEligible, requiredTotalMessages: nextRequiredTotalMessages, requiredTotalShards: nextRequiredTotalShards } = isMemberEligibleForLvlUp(newCurrentLvl, newTotalMessages, newTotalShards)

        // If available lvl role, assign that as well
        const lvlRole = await Actions.fetchLvlRole(interaction.guild, newCurrentLvl);

        let roleToAdd = null;
        if (lvlRole && lvlRole.roleID) {
            // Add the role to the member
            await member?.roles.add(lvlRole.roleID);

            // Set role to add
            roleToAdd = await interaction.guild?.roles.fetch(lvlRole.roleID);
        }

        // User is eligible, create embed
        const embed = new EmbedBuilder()
            .setColor(Colors.DarkPurple)
            .setTitle(`Congrats, ${member?.displayName}!`)
            .setDescription("You've leveled up!\n\n Keep in mind, some levels progress you via server roles as well! If you progressed via server roles as well, the role you were assigned will be shown below! :)")
            .addFields([
                { name: "Lvl:", value: `${currentLvl}->${newCurrentLvl}`},
                { name: "Server role assigned?", value: (lvlRole && lvlRole.roleID) ? `Yes: ${roleToAdd}` : "This level doesn't assign a role" },
                { name: "Shards Spent:", value: `⟠${requiredTotalShards}`},
                { name: `Msgs to Lvl.${newCurrentLvl + 1}:`, value: `Required: ${nextRequiredTotalMessages} / Current: ${newTotalMessages}` },
                { name: "Shards Required:", value: `Required: ⟠${nextRequiredTotalShards} / Current: ⟠${newTotalShards}` },
                { name: "Eligible?", value: nextEligible ? "Yes!" : "No." }
            ]);
    
        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;