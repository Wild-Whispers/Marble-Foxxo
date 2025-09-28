import { HasModPermissionResult, memberHasModPermission } from "@/MarbleFoxxo/lib/helpers/memberHasModPermission";
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";

const name = "mute";
const description = "Mute a server member.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to mute.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("duration")
                .setDescription("Duration (in seconds) to mute the member. Use -1 for a maximum mute (28 days).")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the mute. Leave blank for 'No Reason Given'.")
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

        // Get user to mute
        const userToMute = interaction.options.getUser("user", true);
        if (!userToMute) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified user!`,
                `Specified user: ${userToMute}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Get member to mute from user to mute
        const memberToMute = await interaction.guild?.members.fetch(userToMute.id);
        if (!memberToMute) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified member!`,
                `Specified member: ${memberToMute}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Parse duration
        const MAX_TIMEOUT_MS = Math.floor(28 * 24 * 60 * 60 * 1000) - (1000 * 60 * 5); // 28 days offset by -5 minutes
        const durationGivenInSeconds = interaction.options.getInteger("duration", true);
        const durationInMilliseconds =
            (durationGivenInSeconds * 1000) > MAX_TIMEOUT_MS || durationGivenInSeconds === -1 ?
                MAX_TIMEOUT_MS : Math.floor(durationGivenInSeconds * 1000);
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
        const durationInMinutes = Math.floor((durationInMilliseconds / 1000) / 60);
        const durationInDays = Math.floor((durationInMinutes / 60) / 24);

        // Parse reason given
        const reasonGiven = interaction.options.getString("reason", false) ?? "No Reason Given";

        // Timeout member
        await memberToMute.timeout(durationInMilliseconds, `Applied by ${interaction.user.displayName}: ${reasonGiven}`);
        await Actions.muteMember(memberToMute, durationInMilliseconds, reasonGiven ?? null);

        // Send success message
        const embed = await new EmbedBuilder()
            .setTitle(`✅ Member timed out!`)
            .setDescription(`${memberToMute.displayName} has been timed out successfully!`)
            .addFields([
                { name: "Duration in Seconds:", value: `${durationInSeconds}s`},
                { name: "Duration in Minutes:", value: `${durationInMinutes}m`},
                { name: "Duration in Days:", value: `${durationInDays}d`},
                { name: "Reason:", value: reasonGiven}
            ]);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;