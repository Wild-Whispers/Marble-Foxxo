import { HasModPermissionResult, memberHasModPermission } from "@/MarbleFoxxo/lib/helpers/memberHasModPermission";
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";

const name = "ban";
const description = "Ban a server member.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to ban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the ban. Leave blank for 'No Reason Given'.")
                .setRequired(false)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        // Check if executing member has proper permissions
        const executingMember = interaction.member! as GuildMember;
        const { hasPermission, message: hasPermissionMsg, guildData }: HasModPermissionResult = await memberHasModPermission(executingMember);

        if (!hasPermission || !guildData) {
            const error = await ErrorEmbed(
                hasPermissionMsg,
                `If you believe this is an error, please contact your server administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Get user to ban
        const userToBan = interaction.options.getUser("user", true);
        if (!userToBan) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified user!`,
                `Specified user: ${userToBan}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Get member to ban from user to ban
        const memberToBan = await interaction.guild?.members.fetch(userToBan.id);
        if (!memberToBan) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified member!`,
                `Specified member: ${memberToBan}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Parse reason given
        const reasonGiven = interaction.options.getString("reason", false) ?? "No Reason Given";

        // Timeout member
        await memberToBan.ban({ reason: `Applied by ${interaction.user.displayName}: ${reasonGiven}` });
        await Actions.banMember(memberToBan, reasonGiven ?? null);

        // Send success message
        const embed = await new EmbedBuilder()
            .setTitle(`✅ Member timed out!`)
            .setDescription(`${memberToBan.displayName} has been timed out successfully!`)
            .addFields([
                { name: "Reason:", value: reasonGiven}
            ]);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;