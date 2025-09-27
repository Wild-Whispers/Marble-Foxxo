import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "set-mod-log-channel";
const description = "Set the channel where message logs (edits, etc) are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel where message logs are sent.")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const channel = interaction.options.getChannel("channel", true);

        // Update moderation log channel
        await Actions.setModLogChannel(interaction.guild, channel.id);
        
        await interaction.reply({
            content: `✅ Set <#${channel.id}> as the moderation log channel.`,
            flags: MessageFlags.Ephemeral
        });
    }
};

export default command;