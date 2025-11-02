"use server";

import { addManagementRole } from "@/lib/database/Verification/addManagementRole";
import { setAccessRole } from "@/lib/database/Verification/setAccessRole";
import { setNSFWRole } from "@/lib/database/Verification/setNSFWRole";

export interface ActionUpdateRolesReturn {
    success: boolean,
    message?: string,
    accessRole: string,
    NSFWRole: string,
    managementRoles: Array<string>
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function ActionUpdateRoles(prevState: any, data: FormData): Promise<ActionUpdateRolesReturn> {
    const guildID = data.get("guild-id") as string;
    const accessRole = data.get("accessRole") as string;
    const NSFWRole = data.get("NSFWRole") as string;
    const managementRoles = data.getAll("managementRoles") as Array<string>;

    try {
        // Update channels
        await setAccessRole(guildID, accessRole);
        await setNSFWRole(guildID, NSFWRole);
        for (const mRole of managementRoles) {
            await addManagementRole(guildID, mRole);
        }

        // Return
        return {
            success: true,
            accessRole,
            NSFWRole,
            managementRoles
        };
    } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        console.error("Error updating channels:", error);

        return {
            success: false,
            message: "Error updating channels: " + error,
            accessRole,
            NSFWRole,
            managementRoles
        };
    }
}