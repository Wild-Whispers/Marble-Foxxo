import { SlashCommandBuilder } from "discord.js";

export default function CommandBuilder(name: string, description: string) {
    return new SlashCommandBuilder()
        .setName(name)
        .setDescription(description);
}