import { CachedGuildEditedMessage } from "@/_Interfaces/CachedGuildEditedMessage";
import { getRedis } from "@/lib/redis";
import { Client, Colors, EmbedBuilder, TextChannel } from "discord.js";
import cron from "node-cron";

export default async function startBatchSendModerationLogs(client: Client) {
    const redis = await getRedis();

    cron.schedule("* * * * *", async () => {
        // Get all edited messages
        const keys = await redis.keys("editedmsg:*");

        for (const key of keys) {
            const dataRaw = await redis.hGetAll(key);

            if (!dataRaw || !dataRaw.authorID) continue;

            const data = { ...dataRaw } as CachedGuildEditedMessage;
            const guild = await client.guilds.fetch(data.guildID);

            if (!guild) continue;

            const channel = await guild.channels.fetch(data.channelID);

            if (!channel || !channel?.isTextBased()) continue;

            const embed = new EmbedBuilder()
                .setTitle("📋 Edited Messages Log")
                .setDescription(`Message sent by <@${data.authorID}> edited in <#${channel.id}>:`)
                .setColor(Colors.Yellow)
                .addFields(
                    { name: "Original Msg:", value: data.oldContent },
                    { name: "New Message", value: data.newContent },
                    { name: "Message Created:", value: new Date(parseInt(data.createdTimestamp)).toUTCString() },
                    { name: "Message Edited:", value: new Date(parseInt(data.editedTimestamp)).toUTCString() }
                );

            // Send the embed to the channel
            await (channel as TextChannel).send({ embeds: [embed]});

            // Delete from Redis
            await redis.del(key);
        }
    });
}
