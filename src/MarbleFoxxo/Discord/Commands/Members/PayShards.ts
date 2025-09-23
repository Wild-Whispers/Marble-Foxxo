import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { AttachmentBuilder, ChatInputCommandInteraction, Colors, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import path from "node:path";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";

const name = "pay";
const description = "Pay another user shards!";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("The recipient.")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of shards to pay the recipient.")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const recipientUser = interaction.options.getUser("member")!;
        const amount = Math.floor(interaction.options.getNumber("amount")!); // Ensure integer

        await interaction.deferReply();

        // Fetch member object of recipient
        const recipient = await interaction.guild?.members.fetch(recipientUser.id);

        // Verify recipient member exists
        if (!recipient || !recipientUser) {
            const error = await ErrorEmbed(
                "❌ Recipient not found!",
                "Recipient guild member not found in guild. Please try again, or contact an administrator."
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Verify that recipient exists in database
        const recipientDataRaw = await Actions.fetchGuildMember(recipient);

        // Recipient record not found
        if (!recipientDataRaw) {
            const error = await ErrorEmbed(
                "❌ Recipient record not found!",
                "Recipient guild member not found in database. Please try again, or contact an administrator."
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Verify that member even has enough shards for their bet
        const memberDataRaw = await Actions.fetchGuildMember(interaction.member);

        // Member not found
        if (!memberDataRaw || !memberDataRaw.totalShards) {
            const error = await ErrorEmbed(
                "❌ Member record not found!",
                "Guild member not found in database. Please try again, or contact an administrator."
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Member not enough shards
        if (memberDataRaw.totalShards < amount) {
            const error = await ErrorEmbed(
                "❌ You don't have enough shards!",
                `You tried to pay ${amount} shards. You only have ${memberDataRaw.totalShards} shards!`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Else, pay the shards
        await Actions.payShards(interaction.member, recipient, amount);

        const shard = new AttachmentBuilder(path.join(__dirname, "..", "Fun", "fun_assets", "coins", "shard.png"), { name: "shard.png" });

        const error = await MediaEmbed(
            "✅ You successfully made a payment!",
            `You paid <@${recipient.id}>`,
            Colors.DarkPurple,
            `attachment://shard.png`,
            [
                { name: "Payment Amount:", value: `⟠${amount}` },
                { name: `Your new balance:`, value: `<@${interaction.member?.user.id}>: ⟠${memberDataRaw.totalShards - amount}` },
                { name: `Recipient's new balance:`, value: `<@${recipient.id}>: ⟠${recipientDataRaw.totalShards + amount}` },
            ]
        );

        await interaction.editReply({ embeds: [error], files: [shard] });
    }
};

export default command;