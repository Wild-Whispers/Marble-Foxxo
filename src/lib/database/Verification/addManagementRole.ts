import { getMongo } from "@/lib/mongo";

export async function addManagementRole(guildID: string, roleID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guildID },
            { $addToSet: { permittedToVerify: roleID } }
        );
}