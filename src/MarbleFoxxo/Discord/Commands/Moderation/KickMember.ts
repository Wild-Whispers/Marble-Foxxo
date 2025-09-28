import { HasModPermissionResult, memberHasModPermission } from "@/MarbleFoxxo/lib/helpers/memberHasModPermission";
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";

const name = "kick";
const description = "Kick a server member.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to kick.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the kick. Leave blank for 'No Reason Given'.")
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

        // Get user to kick
        const userToKick = interaction.options.getUser("user", true);
        if (!userToKick) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified user!`,
                `Specified user: ${userToKick}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Get member to kick from user to kick
        const memberToKick = await interaction.guild?.members.fetch(userToKick.id);
        if (!memberToKick) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified member!`,
                `Specified member: ${memberToKick}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Parse reason given
        const reasonGiven = interaction.options.getString("reason", false) ?? "No Reason Given";

        // Timeout member
        await memberToKick.kick(`Applied by ${interaction.user.displayName}: ${reasonGiven}`);
        await Actions.kickMember(memberToKick, reasonGiven ?? null);

        // Send success message
        const embed = await new EmbedBuilder()
            .setTitle(`✅ Member kicked out!`)
            .setDescription(`${memberToKick.displayName} has been kicked successfully!`)
            .addFields([
                { name: "Reason:", value: reasonGiven}
            ]);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;