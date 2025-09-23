import { Colors, EmbedBuilder } from "discord.js";

export default async function ErrorEmbed(
    title: string,
    description: string,
    fields?: Array<{ name: string, value: string, inline?: boolean }>,
    URL?: string,
    image?: string,
    thumbnail?: string,
    footer?: { text: string, iconURL?: string }
) {
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(title)
        .setDescription(description)
        .setURL(URL ?? null)
        .setThumbnail(thumbnail ?? null)
        .addFields(...fields ?? [])
        .setImage(image ?? null)
        .setFooter(footer ?? null);

    return embed;
}