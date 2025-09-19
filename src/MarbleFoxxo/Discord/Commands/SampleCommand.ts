import { ChatInputCommandInteraction } from "discord.js";
import CommandBuilder from "../CommandBuilder";



module.exports = {
    data: await CommandBuilder("ping", "This is a sample command."),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("pong");
    }
};