import { ColorResolvable, EmbedBuilder } from "discord.js";

export default async function MediaEmbed(
    title: string,
    description: string,
    color: ColorResolvable,
    image: string,
    fields?: Array<{ name: string, value: string, inline?: boolean }>,
    URL?: string,
    thumbnail?: string,
    footer?: { text: string, iconURL?: string }
) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setURL(URL ?? null)
        .setThumbnail(thumbnail ?? null)
        .addFields(...fields ?? [])
        .setImage(image)
        .setFooter(footer ?? null);

    return embed;
}