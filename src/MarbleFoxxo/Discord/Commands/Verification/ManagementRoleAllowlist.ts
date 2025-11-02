import { addManagementRole } from "@/lib/database/Verification/addManagementRole";
import { removeManagementRole } from "@/lib/database/Verification/removeManagementRole";
import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "management-role";
const description = "Add a role that is able to manage your server and members via Marble-Foxxo.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand
                .setName("add")
                .setDescription("Add a role to the moderation allowlist.")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role that can verify and moderate your members.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("remove")
                .setDescription("Remove a role to the verify allowlist.")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role that can no longer verify or moderate your members.")
                        .setRequired(true)
                )
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role", true);

        if (subcommand === "add") {
            await addManagementRole(interaction.guildId!, role.id);
            
            await interaction.reply({
                content: `✅ Added <@&${role.id}> as a verify role.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (subcommand === "remove") {
            await removeManagementRole(interaction.guildId!, role.id);

            await interaction.reply({
                content: `❌ Removed <@&${role.id}> from verify roles.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};

export default command;