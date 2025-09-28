import { getMongo } from "@/lib/mongo";
import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "add-mod-role";
const description = "Add a role that is able to verify and moderate your members.";

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
        const mongo = getMongo();

        if (subcommand === "add") {
            await mongo.database
                .collection("guilds")
                .findOneAndUpdate(
                    { guildID: interaction.guildId },
                    { $addToSet: { permittedToVerify: role.id } }
                );
            
            await interaction.reply({
                content: `✅ Added <@&${role.id}> as a verify role.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (subcommand === "remove") {
            await mongo.database
                .collection("guilds")
                .findOneAndUpdate(
                    { guildID: interaction.guildId },
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    { $pull: { permittedToVerify: role.id } } as any
                );

            await interaction.reply({
                content: `❌ Removed <@&${role.id}> from verify roles.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};

export default command;