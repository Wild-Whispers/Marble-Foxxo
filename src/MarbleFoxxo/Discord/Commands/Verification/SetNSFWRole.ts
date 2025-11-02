import { setNSFWRole } from "@/lib/database/Verification/setNSFWRole";
import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "set-nsfw-access-role";
const description = "Set the role that is used in your server for NSFW areas.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand
                .setName("set")
                .setDescription("Set the role used in your server for NSFW areas.")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role that is used in your server for NSFW areas.")
                        .setRequired(true)
                )
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role", true);

        if (subcommand === "set") {
            await setNSFWRole(interaction.guildId!, role.id);
            
            await interaction.reply({
                content: `✅ Set <@&${role.id}> as a NSFW access role.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};

export default command;