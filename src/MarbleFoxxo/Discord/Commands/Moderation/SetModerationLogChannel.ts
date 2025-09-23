import { getMongo } from "@/lib/mongo";
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
        const mongo = getMongo();

        // Update moderation log channel
        await mongo.database
            .collection("guilds")
            .findOneAndUpdate(
                { guildID: interaction.guildId },
                {
                    $set: { moderationLogChannel: channel.id },
                },
                { upsert: true }
            );
        
        await interaction.reply({
            content: `✅ Set <#${channel.id}> as the moderation log channel.`,
            flags: MessageFlags.Ephemeral
        });
    }
};

export default command;