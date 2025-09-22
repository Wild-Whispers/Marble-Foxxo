import { getMongo } from "@/lib/mongo";
import { msToParts } from "@/MarbleFoxxo/lib/msToParts";
import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
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

        // Inject placeholders
        html = html
            .replace("{{AVATAR_URL}}", interaction.guild?.iconURL() ?? "<Avatar Not Found>")
            .replace("{{DISPLAY_NAME}}", interaction.guild?.name ?? "<Name Not Found>")
            .replace("{{MSGS_SENT}}", stats.totalMessages ?? 0)
            .replace("{{TIME_IN_VC}}", stats.vcTotalTime ? msToParts(stats.vcTotalTime) : "-");

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
        await page.setViewport({ width: 1000, height: 550 });

        await page.setContent(html, { waitUntil: "networkidle0" });

        const element = await page.$("#card");
        const buffer = await element!.screenshot({ type: "png" }) as Uint8Array;

        await browser.close();

        const attachment = new AttachmentBuilder(Buffer.from(buffer), { name: `${interaction.guild?.name ?? "unknown_guildname"}.png` });
        await interaction.editReply({ files: [attachment] });
    }
};

export default command;