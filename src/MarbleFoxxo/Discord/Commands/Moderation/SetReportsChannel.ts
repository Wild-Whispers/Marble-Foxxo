import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "set-reports-channel";
const description = "Set the channel where reports from members are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel where reports from members are sent.")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const channel = interaction.options.getChannel("channel", true);

        // Update reports channel
        await Actions.setReportChannel(interaction.guild, channel.id);
        
        await interaction.reply({
            content: `✅ Set <#${channel.id}> as the reports channel.`,
            flags: MessageFlags.Ephemeral
        });
    }
};

export default command;