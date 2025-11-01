import { getMongo } from "@/lib/mongo";

export async function fetchGuildByID(guildID: string) {
    const mongo = getMongo();

    return await mongo.database
        .collection("guilds")
        .findOne({ guildID: guildID });
}