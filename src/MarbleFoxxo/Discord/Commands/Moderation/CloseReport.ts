import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { AttachmentBuilder, ChatInputCommandInteraction, Colors, MessageFlags, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";
import path from "node:path";
import getThreadFromInteraction from "@/MarbleFoxxo/lib/helpers/getThreadFromInteraction";
import { GuildReport } from "@/_Interfaces/GuildReport";

const name = "close-report";
const description = "Set the channel where member join logs are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        // Get the thread
        const thread = getThreadFromInteraction(interaction);

        if (!thread) {
            const error = await ErrorEmbed(
                `❌ No report found for this thread.`,
                `If you believe this is an error, please try again, or contact an administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Verify thread is valid report thread
        const threadData: GuildReport | null = Actions.fetchGuildReport(interaction.guild, thread);

        if (!threadData) {
            const error = await ErrorEmbed(
                `❌ This channel is not a valid report thread. There is nothing to be closed.`,
                `If you believe this is an error, please try again, or contact an administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Calculate total messages in transcript
        const transcriptMessageCount = Array.isArray(threadData.transcript) ? threadData.transcript.length : "0";

        // Send success message
        const iconFile = new AttachmentBuilder(path.join(__dirname, "..", "..", "the_marble_grove.png"), { name: "the_marble_grove.png" });
        const embed = await MediaEmbed(
            `You've successfully closed the report thread.`,
            `There were ${transcriptMessageCount} messages in this transcript.`,
            Colors.Green,
            `attachment://the_marble_grove.png`,
        );

        await interaction.editReply({ embeds: [embed], files: [iconFile] });

        // Delete the channel
        await thread.delete("Thread member requested close.");
    }
};

export default command;