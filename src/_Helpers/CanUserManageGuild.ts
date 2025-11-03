import { fetchGuildByID } from "@/lib/database/Guilds/fetchGuildByID";
import { DiscordFetchGuild } from "@/lib/discord/FetchGuild";
import { DiscordFetchGuildMember } from "@/lib/discord/FetchGuildMember";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function CanUserManageGuild(user: any, guildID: string): Promise<boolean> {
    // Fetch guild from Discord API
    const { message: fetchGuildMsg, data: guild } = await DiscordFetchGuild(guildID);

    if (!guild) {
        console.error(`[Discord API Error] [CanUserManageGuild] Guild ${guildID} could not be found.`);
        return false;
    }

    if (fetchGuildMsg) {
        console.error(`[Discord API Error] [CanUserManageGuild] Could not fetch guild ${guildID}:`, fetchGuildMsg);
        return false;
    }

    // Fastest & easiest: Check if guild owner ID matches uid
    if (user.id === guild.owner_id) return true;

    // Fetch the guild
    const DBGuild = await fetchGuildByID(guildID);

    if (!DBGuild) {
        console.error(`[Database Error] [CanUserManageGuild] Guild ${guildID} could not be found in the database.`);
        return false;
    }

    // Fetch the guild member's list of roles in the guild
    const { message: fetchMemberRolesMsg, data: member } = await DiscordFetchGuildMember(guildID, user.id);

    if (!member) {
        console.error(`[Discord API Error] [CanUserManageGuild] Guild ${guildID} member could not be found for user ${user.id}`);
        return false;
    }

    if (fetchMemberRolesMsg) {
        console.error(`[Discord API Error] [CanUserManageGuild] Could not fetch guild member roles for user ${user.id} in guild ${guildID}:`, fetchMemberRolesMsg);
        return false;
    }

    if (member.roles.length === 0) {
        console.warn(`[Warn] [CanUserManageGuild] User ${user.id} has no roles in guild ${guildID}.`);
        return false;
    }

    // Parse management roles
    const managementRoleIDs: Array<string> = DBGuild.permittedToVerify ?? [];

    if (managementRoleIDs.length === 0) {
        console.warn(`[Warn] [CanUserManageGuild] Guild ${guildID} has not set any management roles.`);
        return false;
    }

    // Last, attempt to check if the member has any management roles
    return managementRoleIDs.some(roleID => member.roles.includes(roleID));
}