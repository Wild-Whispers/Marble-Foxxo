import { AttachmentBuilder, ChatInputCommandInteraction, Colors, SlashCommandBuilder } from "discord.js";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";
import path from "node:path";

const name = "roll-d20";
const description = "Roll a D20!";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        // Fetch all possible die faces
        const faces = Array.from({ length: 20 }, (_, i) => new AttachmentBuilder(path.join(__dirname, "fun_assets", "die", `${i + 1}.png`), { name: `${i + 1}.png` }));

        // Fetch random face
        const randIndex = Math.floor(Math.random() * (faces.length - 0) + 0);

        // Create embed
        const embed = await MediaEmbed(
            `✅ You rolled a D20!`,
            `You rolled a ${randIndex + 1}!`,
            Colors.Green,
            `attachment://${randIndex + 1}.png`,
        );

        // Reply
        await interaction.editReply({ embeds: [embed], files: [faces[randIndex]]})
    }
};

export default command;