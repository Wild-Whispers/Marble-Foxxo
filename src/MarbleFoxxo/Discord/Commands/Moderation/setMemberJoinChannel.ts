import { setMemberJoinLogChannel } from "@/lib/database/Moderation/setMemberJoinLogChannel";
import { ChatInputCommandInteraction, Guild, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "set-member-join-channel";
const description = "Set the channel where member join logs are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel where member join logs are sent.")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const channel = interaction.options.getChannel("channel", true);

        // Update moderation log channel
        await setMemberJoinLogChannel(interaction.guild as Guild, channel.id);
        
        await interaction.reply({
            content: `✅ Set <#${channel.id}> as the member join log channel.`,
            flags: MessageFlags.Ephemeral
        });
    }
};

export default command;