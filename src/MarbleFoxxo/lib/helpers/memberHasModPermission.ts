import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { GuildMember } from "discord.js";

export interface HasModPermissionResult {
    hasPermission: boolean,
    message: string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    guildData?: any
}

export async function memberHasModPermission(member: GuildMember): Promise<HasModPermissionResult> {
    const guildData = await Actions.fetchGuild(member.guild);
    
    if (!guildData || !guildData.permittedToVerify || guildData.permittedToVerify.length === 0) {
        return {
            hasPermission: false,
            message: `❌ You don't have permission to use this command.\n\n[No mod/permissions roles set by server admin]\n\nAdd them with \`/add-mod-role\`.`
        };
    }
    
    const permittedRoles = guildData.permittedToVerify;
    const hasPermittedRole = member.roles.cache.some(role => permittedRoles.includes(role.id));

    if (!hasPermittedRole) {
        return {
            hasPermission: false,
            message: `❌ You don't have permission to use this command.`
        };
    }

    return {
        hasPermission: true,
        message: `✅ [INTERNAL MESSAGE] Member has moderation permission.`,
        guildData: guildData
    };
}