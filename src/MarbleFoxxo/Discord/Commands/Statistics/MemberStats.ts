import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { msToParts } from "@/MarbleFoxxo/lib/helpers/msToParts";
import { AttachmentBuilder, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { readFileSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const name = "stats";
const description = "Fetch the stats for a particular server member.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to fetch stats for.")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const member = interaction.options.getMember("user")! as GuildMember;
        const user = await member.user.fetch();

        const stats = await Actions.fetchGuildMember(member);

        if (!stats) {
            await interaction.reply({
                content: `No stats were found for ${member}!`,
            });

            return;
        }

        // Defer reply
        await interaction.deferReply();
        
        // Define HTML
        let html = readFileSync(path.join(__dirname, "..", "..", "HTML", "member_stats.html"), "utf8");

        // Inject placeholders
        html = html
            .replace("{{AVATAR_URL}}", stats.avatar)
            .replace("{{DISPLAY_NAME}}", user.displayName)
            .replace("{{TOTAL_SHARDS}}", stats.totalShards ?? "?")
            .replace("{{MUTED}}", stats.timesMuted ?? 0)
            .replace("{{WARNED}}", stats.timesWarned ?? 0)
            .replace("{{KICKED}}", stats.timesKicked ?? 0)
            .replace("{{BANNED}}", stats.timesBanned ?? 0)
            .replace("{{JOINED_VC}}", stats.lastJoinedVCTimestamp ? new Date(stats.lastJoinedVCTimestamp).toDateString() : "-")
            .replace("{{LEFT_VC}}", stats.lastLeftVCTimestamp ? new Date(stats.lastLeftVCTimestamp).toDateString() : "-")
            .replace("{{MSGS_SENT}}", stats.msgsSent ?? 0)
            .replace("{{MSGS_EDITED}}", stats.msgsEdited ?? 0)
            .replace("{{TIME_IN_VC}}", stats.vcTotalTime ? msToParts(stats.vcTotalTime) : "-")
            .replace("{{LONGEST_VC}}", stats.vcLongestSession ? msToParts(stats.vcLongestSession) : "-")
            .replace("{{VC_JOINS}}", stats.vcJoins ?? 0)
            .replace("{{STREAMING_SESSIONS}}", stats.streamingSessionsStarted ?? 0)
            .replace("{{ATTACHMENTS_SHARED}}", stats.attachmentsShared ?? 0)
            .replace("{{POLL_VOTES}}", stats.pollVotesCast ?? 0);

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
        await page.setViewport({ width: 1275, height: 1024 });

        await page.setContent(html, { waitUntil: "networkidle0" });

        const element = await page.$("#card");
        const buffer = await element!.screenshot({ type: "png" }) as Uint8Array;

        await browser.close();

        const attachment = new AttachmentBuilder(Buffer.from(buffer), { name: `${member.displayName}.png` });
        await interaction.editReply({ files: [attachment] });
    }
};

export default command;