import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";
import { getMongo } from "@/lib/mongo";

export async function setLvlUpNotificationsDestination(guildID: string, setting: LvlUpNotifactionDestinations, channelID: string | null) {
    const mongo = getMongo();

    await mongo.database
        .collection("guilds")
        .findOneAndUpdate(
            { guildID: guildID },
            {
                $set: { lvlUpNotificationDestination: { setting, channelID: channelID ?? null } },
            },
            { upsert: true }
        );
}