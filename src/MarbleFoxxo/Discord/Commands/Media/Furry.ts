import { getRedis } from "@/lib/redis";
import { ChatInputCommandInteraction, Colors, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import { CachedMedia } from "@/_Interfaces/CachedMedia";
import MediaEmbed from "../../EmbedWrappers/MediaEmbed";

const name = "furry-media";
const description = "Set the channel where message logs (edits, etc) are sent.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option
                .setName("orientation")
                .setDescription("The sexual orientation to search for.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("rating")
                .setDescription("NSFW or SFW")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        let orientation = interaction.options.getString("orientation")!;
        const rating = interaction.options.getString("rating")!;
        const redis = await getRedis();

        // Defer reply
        await interaction.deferReply();

        // Verify orientation
        const validOrientations = [
            "male/male",
            "male/female",
            "solo-male",
            "solo-female"
        ];

        if (!validOrientations.includes(orientation.toLowerCase())) {
            const error = await ErrorEmbed(
                "❌ Invalid Orientation",
                "Orientation must be one of the following:",
                validOrientations.map(item => { return { name: "-", value: item } })
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Parse orientation
        switch (orientation.toLowerCase()) {
            case "male/male":
                orientation = "gay";
                break;
            case "male/female":
                orientation = "straight";
                break;
            default:
                // Solo male and solo female aren't in need of parsing
                break;
        }

        // Verify rating
        const validRatings = [
            "nsfw",
            "sfw"
        ];
        
        if (!validRatings.includes(rating.toLowerCase())) {
            const error = await ErrorEmbed(
                "❌ Invalid Rating",
                "Rating must be one of the following:",
                validRatings.map(item => { return { name: "-", value: item } })
            );

            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Generic error
        const genericErrorEmbed = await ErrorEmbed(
            "❌ Unexpected Error!",
            "The selected post was not parsable. Please try again, or contact an administrator."
        );

        // Fetch keys
        const keyToFind = `${rating}:${orientation}:media:*`;
        const keys = await redis.keys(keyToFind);

        // Verify key exists
        if (!keys || keys.length === 0) {
            await interaction.editReply({ embeds: [genericErrorEmbed] });

            return;
        }

        // Fetch a random
        const randIndex = Math.round(Math.random() * ((keys.length - 1) - 0) + 0);
        const mediaRaw = await redis.hGetAll(keys[randIndex]);

        // If post not parsable or non-existent
        if (!mediaRaw || Object.keys(mediaRaw).length === 0) {
            await interaction.editReply({ embeds: [genericErrorEmbed] });

            return;
        }

        const media = JSON.parse(mediaRaw.data) as CachedMedia;

        // If items missing on media
        if (
            !media.file ||
            !media.file.url ||
            !media.createdAt ||
            !media.updatedAt ||
            !media.score ||
            !media.rating
        ) {
            await interaction.editReply({ embeds: [genericErrorEmbed] });

            return;
        }

        // // Process and send embed
        const embed = await MediaEmbed(
            `Here you go, ${interaction.member?.user.username}!`,
            "Enjoy :3",
            Colors.Fuchsia,
            media.file.url,
            [
                { name: "Rating:", value: media.rating },
                { name: "Score:", value: media.score.toString() },
                { name: "Created At:", value: media.createdAt },
                { name: "Updated At:", value: media.updatedAt },
                { name: "Source:", value: media.file.url }
            ]
        );
        
        // Send attachment
        try {
            await interaction.editReply({ embeds: [embed] });

            // Remove media from cache
            await redis.del(keyToFind);

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            console.error(`[${new Date().toISOString()}] [Media Interaction] An unknown error occurred:`, error);

            const unknownErrorEmbed = await ErrorEmbed(
                "❌ Unknown Error",
                "An unknown error occurred. Please try again, or contact an administrator.",
            );

            await interaction.editReply({ embeds: [unknownErrorEmbed] });

            return;
        }
    }
};

export default command;