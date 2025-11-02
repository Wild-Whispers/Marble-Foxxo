import { getMongo } from "@/lib/mongo";

export async function setNSFWRole(guildID: string, roleID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guildID },
            { $set: { nsfwRole: roleID } }
        );
}