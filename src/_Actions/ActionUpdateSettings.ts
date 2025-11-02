"use server";

import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";
import { setLvlUpNotificationsDestination } from "@/lib/database/Guilds/setLvlUpNotificationDestination";

export interface ActionUpdateChannelsReturn {
    success: boolean,
    message?: string,
    lvlUpNotificationDestination: { setting: LvlUpNotifactionDestinations, channel: string | null },
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function ActionUpdateSettings(prevState: any, data: FormData): Promise<ActionUpdateChannelsReturn> {
    const guildID = data.get("guild-id") as string;
    const lvlUpNotificationDestinationSetting = data.get("lvlUpNotificationDestinationSetting") as LvlUpNotifactionDestinations;
    const lvlUpNotificationDestinationChannel = data.get("lvlUpNotificationDestinationChannel") as string | null;

    try {
        // Update channels
        await setLvlUpNotificationsDestination(guildID, lvlUpNotificationDestinationSetting, lvlUpNotificationDestinationChannel);

        // Return
        return {
            success: true,
            lvlUpNotificationDestination: { setting: lvlUpNotificationDestinationSetting, channel: lvlUpNotificationDestinationChannel },
        };
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error("Error updating channels:", error);

        return {
            success: false,
            message: "Error updating channels: " + error,
            lvlUpNotificationDestination: { setting: lvlUpNotificationDestinationSetting, channel: lvlUpNotificationDestinationChannel },
        };
    }
}