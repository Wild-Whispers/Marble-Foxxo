import { getMongo } from "@/lib/mongo";

export async function removeManagementRole(guildID: string, roleID: string) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guildID },
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            { $pull: { permittedToVerify: roleID } } as any
        );
}