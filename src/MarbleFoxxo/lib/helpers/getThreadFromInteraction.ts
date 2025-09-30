import { ChannelType, ChatInputCommandInteraction, PrivateThreadChannel, PublicThreadChannel } from "discord.js";

export default function getThreadFromInteraction(interaction: ChatInputCommandInteraction): PrivateThreadChannel | PublicThreadChannel<false> | null {
    const channel = interaction.channel;

    if (!channel) return null;

    if (channel.type === ChannelType.PrivateThread || channel.type === ChannelType.PublicThread) return channel as PrivateThreadChannel | PublicThreadChannel<false>;

    return null;
}