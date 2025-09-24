import { CachedGuildDeletedMessage } from "@/_Interfaces/CachedGuildDeletedMessage";
import { CachedGuildEditedMessage } from "@/_Interfaces/CachedGuildEditedMessage";
import { getMongo } from "@/lib/mongo";
import { getRedis } from "@/lib/redis";
import { Client, Colors, EmbedBuilder, TextChannel } from "discord.js";
import cron from "node-cron";

export default async function startBatchSendModerationLogs(client: Client) {
    const redis = await getRedis();
    const mongo = getMongo();

    cron.schedule("* * * * *", async () => {
        // Get all edited messages
        const editedKeys = await redis.keys("editedmsg:*");

        for (const key of editedKeys) {
            const dataRaw = await redis.hGetAll(key);

            if (!dataRaw || !dataRaw.authorID) continue;

            const data = { ...dataRaw } as CachedGuildEditedMessage;
            const guild = await client.guilds.fetch(data.guildID);

            if (!guild) continue;

            const guildDataRaw = await mongo.database
                .collection("guilds")
                .findOne({ guildID: guild.id });

            if (!guildDataRaw) continue;

            const channel = await guild.channels.fetch(guildDataRaw.moderationLogChannel);
            const messageChannel = await guild.channels.fetch(data.channelID);

            if (
                !channel ||
                !channel?.isTextBased() ||
                !messageChannel ||
                !messageChannel.isTextBased()
            ) continue;

            // Get author
            const author = await guild.members.fetch(data.authorID);

            const embed = new EmbedBuilder()
                .setTitle("📋 Edited Messages Log")
                .setDescription(`Message sent by ${author.displayName} edited in <#${data.channelID}>:`)
                .setColor(Colors.Yellow)
                .addFields(
                    { name: "Original Msg:", value: data.oldContent },
                    { name: "New Message:", value: data.newContent },
                    { name: "Message Created:", value: new Date(parseInt(data.createdTimestamp)).toUTCString() },
                    { name: "Message Edited:", value: new Date(parseInt(data.editedTimestamp)).toUTCString() }
                );

            // Send the embed to the channel
            await (channel as TextChannel).send({ embeds: [embed]});

            // Delete from Redis
            await redis.del(key);
        }

        // Get all deleted messages
        const deletedKeys = await redis.keys("deletedmsg:*");

        for (const key of deletedKeys) {
            const dataRaw = await redis.hGetAll(key);

            if (!dataRaw || !dataRaw.authorID) continue;

            const data = { ...dataRaw } as CachedGuildDeletedMessage;
            const guild = await client.guilds.fetch(data.guildID);

            if (!guild) continue;

            const guildDataRaw = await mongo.database
                .collection("guilds")
                .findOne({ guildID: guild.id });

            if (!guildDataRaw) continue;

            const channel = await guild.channels.fetch(guildDataRaw.moderationLogChannel);
            const messageChannel = await guild.channels.fetch(data.channelID);

            if (
                !channel ||
                !channel?.isTextBased() ||
                !messageChannel ||
                !messageChannel.isTextBased()
            ) continue;

            // Get author
            const author = await guild.members.fetch(data.authorID);

            const embed = new EmbedBuilder()
                .setTitle("📋 Edited Messages Log")
                .setDescription(`Message sent by ${author.displayName} deleted in <#${data.channelID}>:`)
                .setColor(Colors.Yellow)
                .addFields(
                    { name: "Original Msg:", value: data.content },
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
