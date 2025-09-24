import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { AttachmentBuilder, ChatInputCommandInteraction, Colors, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";
import path from "node:path";

const name = "coin-toss";
const description = "Do a coin toss! You get the computer's bet if your coin wins!";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addBooleanOption(option =>
            option
                .setName("heads-or-tails")
                .setDescription("true = heads, false = tails")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName("shards")
                .setDescription("The amount of shards you want to bet! [Max 20]")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const hot = interaction.options.getBoolean("heads-or-tails", true)!; // hot = headsortails lol. I thought the acronym was funny so I kept it.
        const playerBet = Math.floor(interaction.options.getNumber("shards", true)!); // Ensure integer

        await interaction.deferReply();

        // Verify that player even has enough shards for their bet
        const memberDataRaw = await Actions.fetchGuildMember(interaction.member);

        // Member not found
        if (!memberDataRaw || !memberDataRaw.totalShards === null || !memberDataRaw.totalShards === undefined) {
            const error = await ErrorEmbed(
                "❌ Member record not found!",
                "Guild member not found in database. Please try again, or contact an administrator."
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Player not enough shards
        if (memberDataRaw.totalShards < playerBet) {
            const error = await ErrorEmbed(
                "❌ You don't have enough shards!",
                `You bet ${playerBet} shards. You only have ${memberDataRaw.totalShards} shards!`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Player bet too many shards bet
        if (playerBet > 20) {
            const error = await ErrorEmbed(
                "❌ Bet too large!",
                `The max bet is 20 shards!`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Player bet too little shards bet
        if (playerBet === 1) {
            const error = await ErrorEmbed(
                "❌ Bet too small!",
                `The minimum bet is 1 shard!`
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Calculate computer bet
        const compMin = 1;
        const compMax = 20;
        const computerBet = Math.floor(Math.random() * (compMax - compMin) + compMin);

        // Calculate heads or tails
        const heads = Math.random() < 0.5;

        // Get image attachments for coins
        const headsFile = new AttachmentBuilder(path.join(__dirname, "fun_assets", "coins", "heads.png"), { name: "heads.png" });
        const tailsFile = new AttachmentBuilder(path.join(__dirname, "fun_assets", "coins", "tails.png"), { name: "tails.png" });

        // Player won with heads
        if (hot && heads) {
            const win = await MediaEmbed(
                "✅ You picked heads and won!",
                `You have been awarded ${computerBet} shards!`,
                Colors.Green,
                `attachment://heads.png`,
                [
                    { name: "Your Bet:", value: playerBet.toString() },
                    { name: "Computer's Bet:", value: computerBet.toString() },
                    { name: "Shards Before:", value: memberDataRaw.totalShards.toString() },
                    { name: "Shards After:", value: (memberDataRaw.totalShards + computerBet + playerBet).toString() }
                ]
            );

            await Actions.incrementShards(interaction.member, computerBet + playerBet);

            await interaction.editReply({ embeds: [win], files: [headsFile] });

            return;
        }

        // Player won with tails
        if (!hot && !heads) {
            const win = await MediaEmbed(
                "✅ You picked tails and won!",
                `You have been awarded ${computerBet} shards!`,
                Colors.Green,
                `attachment://tails.png`,
                [
                    { name: "Your Bet:", value: playerBet.toString() },
                    { name: "Computer's Bet:", value: computerBet.toString() },
                    { name: "Shards Before:", value: memberDataRaw.totalShards.toString() },
                    { name: "Shards After:", value: (memberDataRaw.totalShards + computerBet + playerBet).toString() }
                ]
            );

            await Actions.incrementShards(interaction.member, computerBet + playerBet);

            await interaction.editReply({ embeds: [win], files: [tailsFile] });

            return;
        }

        // Player picked heads and lost
        if ((hot && !heads)) {
            const loss = await MediaEmbed(
                "🚫 You picked heads and lost!",
                `You have lost ${playerBet} shards!`,
                Colors.Red,
                `attachment://heads.png`,
                [
                    { name: "Your Bet:", value: playerBet.toString() },
                    { name: "Computer's Bet:", value: computerBet.toString() },
                    { name: "Shards Before:", value: memberDataRaw.totalShards.toString() },
                    { name: "Shards After:", value: (memberDataRaw.totalShards - playerBet).toString() }
                ]
            );

            await Actions.incrementShards(interaction.member, -playerBet);

            await interaction.editReply({ embeds: [loss], files: [headsFile] });

            return;
        }

        // Player picked tails and lost
        if (!hot && heads) {
            const loss = await MediaEmbed(
                "🚫 You picked tails and lost!",
                `You have lost ${playerBet} shards!`,
                Colors.Red,
                `attachment://tails.png`,
                [
                    { name: "Your Bet:", value: playerBet.toString() },
                    { name: "Computer's Bet:", value: computerBet.toString() },
                    { name: "Shards Before:", value: memberDataRaw.totalShards.toString() },
                    { name: "Shards After:", value: (memberDataRaw.totalShards - playerBet).toString() }
                ]
            );

            await Actions.incrementShards(interaction.member, -playerBet);

            await interaction.editReply({ embeds: [loss], files: [tailsFile] });

            return;
        }
    }
};

export default command;