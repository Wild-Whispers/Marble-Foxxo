import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";

export interface LvlUpNotificationsDestinationInterface {
    setting: LvlUpNotifactionDestinations,
    channelID: string | null
}