import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const name = "ping";
const description = "This is a sample command.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("pong");
    }
};

export default command;