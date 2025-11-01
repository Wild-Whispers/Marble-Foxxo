import { setMemberLeaveLogChannel } from "@/lib/database/Moderation/setMemberLeaveLogChannel";
import { ChatInputCommandInteraction, Guild, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "set-member-leave-channel";
const description = "Set the channel where member leave logs are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel where member leave logs are sent.")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const channel = interaction.options.getChannel("channel", true);

        // Update moderation log channel
        await setMemberLeaveLogChannel(interaction.guild as Guild, channel.id);
        
        await interaction.reply({
            content: `✅ Set <#${channel.id}> as the member leave log channel.`,
            flags: MessageFlags.Ephemeral
        });
    }
};

export default command;