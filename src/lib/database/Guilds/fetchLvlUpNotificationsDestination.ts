import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";
import { LvlUpNotificationsDestinationInterface } from "@/_Interfaces/LvlUpNotificationsDestination";
import { getMongo } from "@/lib/mongo";

export async function fetchLvlUpNotificationsDestination(guildID: string): Promise<LvlUpNotificationsDestinationInterface> {
    const mongo = getMongo();

    const guild = await mongo.database
        .collection("guilds")
        .findOne({ guildID: guildID });

    return guild?.lvlUpNotificationDestination ?? {
        setting: LvlUpNotifactionDestinations.RELATIVE_CHANNEL,
        channelID: null
    }
}