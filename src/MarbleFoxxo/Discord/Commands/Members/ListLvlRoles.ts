import { LevelRoles } from "@/_Interfaces/LevelRoles";
import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "list-lvl-roles";
const description = "List all of the server's current level roles.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        // Fetch all level roles
        const rolesRaw = await Actions.fetchAllLvlRoles(interaction.guild);

        const fields = [];
        if (rolesRaw) {
            const roles = rolesRaw as LevelRoles;

            for (const roleData of Object.values(roles)) {
                if (!roleData) continue;

                const role = await interaction.guild?.roles.fetch(roleData.roleID);

                fields.push({ name: `Lvl.${roleData.lvl}`, value: `${role}`});
            }
        }

        // Success
        const embed = new EmbedBuilder()
            .setColor(rolesRaw ? Colors.Green : Colors.Yellow)
            .setTitle("Level Roles List")
            .setDescription("Here is a list of all of your server's assigned level roles.\n\n When a server member levels up to any of these levels, they will be automatically assigned the paired role.")
            .addFields(
                rolesRaw ? fields : [{ name: ":(", value: "You have not set any level roles yet. Do so with `/add-lvl-role`" }]
            );
    
        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;