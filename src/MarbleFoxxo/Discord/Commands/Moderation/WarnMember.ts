import { HasModPermissionResult, memberHasModPermission } from "@/MarbleFoxxo/lib/helpers/memberHasModPermission";
import { AttachmentBuilder, ChatInputCommandInteraction, Colors, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";
import path from "node:path";

const name = "warn";
const description = "warn a server member.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to warn.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the warn. Leave blank for 'No Reason Given'.")
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

        // Get user to warn
        const userToWarn = interaction.options.getUser("user", true);
        if (!userToWarn) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified user!`,
                `Specified user: ${userToWarn}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Get member to warn from user to warn
        const memberToWarn = await interaction.guild?.members.fetch(userToWarn.id);
        if (!memberToWarn) {
            const error = await ErrorEmbed(
                `❌ Unable to find specified member!`,
                `Specified member: ${memberToWarn}`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Parse reason given
        const reasonGiven = interaction.options.getString("reason", false) ?? "No Reason Given";

        // Warn member
        await Actions.warnMember(memberToWarn, reasonGiven ?? null);

        // Send DM to member
        const iconFile = new AttachmentBuilder(path.join(__dirname, "..", "..", "the_marble_grove.png"), { name: "the_marble_grove.png" });
        const warnEmbed = await MediaEmbed(
            `You've been given a warning in ${interaction.guild?.name}!`,
            `Applied by ${interaction.user.displayName}: ${reasonGiven}`,
            Colors.Orange,
            `attachment://the_marble_grove.png`
        );
        await memberToWarn.send({ embeds: [warnEmbed], files: [iconFile] });

        // Send success message
        const embed = await new EmbedBuilder()
            .setTitle(`✅ Member warned!`)
            .setDescription(`${memberToWarn.displayName} has been warned successfully!`)
            .addFields([
                { name: "Reason:", value: reasonGiven}
            ]);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;