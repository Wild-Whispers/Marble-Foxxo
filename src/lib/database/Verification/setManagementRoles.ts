import { getMongo } from "@/lib/mongo";

export async function setManagementRoles(guildID: string, roleIDs: Array<string>) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guildID },
            { $set: { permittedToVerify: roleIDs } }
        );
}