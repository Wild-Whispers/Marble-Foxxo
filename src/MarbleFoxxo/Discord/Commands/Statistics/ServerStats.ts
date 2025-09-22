import { getMongo } from "@/lib/mongo";
import { msToParts } from "@/MarbleFoxxo/lib/msToParts";
import { AttachmentBuilder, ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { readFileSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const name = "server-stats";
const description = "Fetch the stats for the server.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        //const member = interaction.options.getMember("user")! as GuildMember;
        const mongo = getMongo();

        const stats = await mongo.database
            .collection("guilds")
            .findOne({ guildID: interaction.guildId });

        if (!stats) {
            await interaction.reply({
                content: `No stats were found for guild ${interaction.guild?.name}!`,
            });

            return;
        }

        // Defer reply
        await interaction.deferReply();
        
        // Define HTML
        let html = readFileSync(path.join(__dirname, "..", "..", "HTML", "server_stats.html"), "utf8");

        // Filter channel types
        const channelsCache = interaction.guild?.channels.cache;
        const textChannels = channelsCache?.filter(
            ch => ch.type === ChannelType.GuildText
        ).size;

        const voiceChannels = channelsCache?.filter(
            ch => ch.type === ChannelType.GuildVoice
        ).size;

        const categories = channelsCache?.filter(
            ch => ch.type === ChannelType.GuildCategory
        ).size;

        // Fetch guild owner
        const owner = await interaction.guild?.members.fetch(interaction.guild.ownerId);

        // Fetch longest booster
        const boosters = interaction.guild?.members.cache.filter(
            member => member.premiumSince !== null
        );
        const topBooster = boosters
            ?.sort((a, b) => (a.premiumSince!.getTime() - b.premiumSince!.getTime()))
            .first();

        // Inject placeholders
        html = html
            .replace("{{OWNER_NAME}}", owner?.displayName ?? "<Name Not Found>")
            .replace("{{TOTAL_MEMBERS}}", interaction.guild?.memberCount.toString() ?? "<Member Count Unknown>")
            .replace("{{BOOSTER_LEVEL}}", interaction.guild?.premiumTier.toString() ?? "<Unknown Booster Level>")
            .replace("{{BOOSTER_COUNT}}", interaction.guild?.premiumSubscriptionCount?.toString() ?? " <Unknown Booster Count>")
            .replace("{{TOP_BOOSTER}}", topBooster?.displayName ?? "-")
            .replace("{{TOTAL_CHANNELS}}", interaction.guild?.channels.cache.size.toString() ?? "<Channel Count Unknown>")
            .replace("{{TEXT_CHANNELS}}", textChannels?.toString() ?? "<Text Channels Unknown>")
            .replace("{{VOICE_CHANNELS}}", voiceChannels?.toString() ?? "<Voice Channels Unknown>")
            .replace("{{CATEGORIES}}", categories?.toString() ?? "<Categories Count Unknown>")
            .replace("{{AVATAR_URL}}", interaction.guild?.iconURL() ?? "<Avatar Not Found>")
            .replace("{{DISPLAY_NAME}}", interaction.guild?.name ?? "<Name Not Found>")
            .replace("{{MSGS_SENT}}", stats.totalMessages ?? 0)
            .replace("{{TIME_IN_VC}}", stats.vcTotalTime ? msToParts(stats.vcTotalTime) : "-")
            .replace("{{EMOJIS_COUNT}}", interaction.guild?.emojis.cache.size.toString() ?? "<Unknown Emoji Count>")
            .replace("{{STICKERS_COUNT}}", interaction.guild?.stickers.cache.size.toString() ?? "<Unknown Sticker Count>")
            .replace("{{ROLES_COUNT}}", interaction.guild?.roles.cache.size.toString() ?? "<Unknown Roles Count>")
            .replace("{{BOTS_COUNT}}", interaction.guild?.members.cache.filter(m => m.user.bot).size.toString() ?? "<Unknown Roles Count>");

        // Build image embed
        const isProd = process.env.MODE! === "production" ? true : false;
        let browser = null;
        
        if (isProd) {
            browser = await puppeteer.launch();
        } else {
            browser = await puppeteer.launch({
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--no-zygote",
                ]
            });
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 1000, height: 1024 });

        await page.setContent(html, { waitUntil: "networkidle0" });

        const element = await page.$("#card");
        const buffer = await element!.screenshot({ type: "png" }) as Uint8Array;

        await browser.close();

        const attachment = new AttachmentBuilder(Buffer.from(buffer), { name: `${interaction.guild?.name ?? "unknown_guildname"}.png` });
        await interaction.editReply({ files: [attachment] });
    }
};

export default command;