import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { AttachmentBuilder, ChannelType, ChatInputCommandInteraction, Colors, Message, MessageFlags, SlashCommandBuilder, ThreadAutoArchiveDuration } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";
import path from "node:path";
import { listenToThread } from "@/MarbleFoxxo/MarbleFoxxo";

const name = "create-report";
const description = "Set the channel where member join logs are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        // Fetch reports channel
        let guildData = await Actions.fetchGuild(interaction.guild);

        if (!guildData || !guildData.reportsChannel) {
            const error = await ErrorEmbed(
                `❌ An unexpected error occurred generating the report channel.`,
                `Please try again, or contact an administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        const reportsChannel = await interaction.guild?.channels.fetch(guildData.reportsChannel);

        // Ensure channel is the correct type of channel
        if (
            !reportsChannel ||
            (reportsChannel.type !== ChannelType.GuildText && reportsChannel.type !== ChannelType.GuildAnnouncement)
        ) {
            const error = await ErrorEmbed(
                `❌ An unexpected error occurred generating the report channel.`,
                `Please try again, or contact an administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Increment report
        guildData = await Actions.incrementReports(interaction.guild);

        if (!guildData || !guildData.reportsCount) {
            const error = await ErrorEmbed(
                `❌ An unexpected error occurred generating the report channel.`,
                `Please try again, or contact an administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Attempt to create the thread
        try {
            const reportingUser = await interaction.guild?.members.fetch(interaction.user.id);

            const thread = await reportsChannel.threads.create({
                name: `report-${guildData.reportsCount}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                reason: `Member '${reportingUser?.displayName}' requested a report channel.`
            });
            
            // Generate link to thread and send
            const iconFile = new AttachmentBuilder(path.join(__dirname, "..", "..", "the_marble_grove.png"), { name: "the_marble_grove.png" });
            const embed = await MediaEmbed(
                `You've successfully created a report thread.`,
                `Please enter the thread and explain any/all relevant details related to your report. `,
                Colors.Green,
                `attachment://the_marble_grove.png`,
                [{ name: "Thread Link:", value: `${thread.toString()}` }]
            );

            await interaction.editReply({ embeds: [embed], files: [iconFile] });

            // Add user to thread & generate link to thread
            await thread.members.add(interaction.user.id);

            // Add mods to channel
            if (guildData.permittedToVerify && Array.isArray(guildData.permittedToVerify) && guildData.permittedToVerify.length > 0) {
                const modRoles = guildData.permittedToVerify as Array<string>;

                const roleFields = [{ name: "Reporting User:", value: `${reportingUser}` }];
                let staffRoleI = 1;
                for (const roleID of modRoles) {
                    const role = await interaction.guild?.roles.fetch(roleID);

                    if (role) {
                        roleFields.push({ name: `Staff Role #${staffRoleI}:`, value: `${role}` });
                        staffRoleI++;
                    }
                }

                const embed = await MediaEmbed(
                    `Report Thread #${guildData.reportsCount}`,
                    `Please enter the thread and explain any/all relevant details related to your report. A staff member will be with you shortly.\n\nTranscript will only records messages for 3 days after thread creation.`,
                    Colors.Green,
                    `attachment://the_marble_grove.png`,
                    roleFields
                );

                // Send to the thread
                await thread.send({ embeds: [embed] });

                // Finally attach the listener to it
                const stopListening = await listenToThread(thread, async (msg: Message) => {
                    await Actions.appendReportMessage(interaction.guild, thread, msg);
                });

                // Stop listening after a period
                setTimeout(() => {
                    stopListening();
                }, 1000 * 60 * 60 * 24 * 3 /* 3 days */);
            }
        } catch (err: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
            console.error(`[${new Date().toISOString()}] [Reports Thread Error]`, err);

            const error = await ErrorEmbed(
                `❌ An unexpected error occurred generating the report channel.`,
                `Please try again, or contact an administrator.`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }
    }
};

export default command;