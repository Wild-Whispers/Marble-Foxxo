import { getMongo } from "@/lib/mongo";
import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const name = "set-general-access-role";
const description = "Set the role that is used in your server for general server admission.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand
                .setName("set")
                .setDescription("Set the role used in your server for general server admission.")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role that is used in your server for general server admission.")
                        .setRequired(true)
                )
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role", true);
        const mongo = getMongo();

        if (subcommand === "set") {
            await mongo.database
                .collection("guilds")
                .findOneAndUpdate(
                    { guildID: interaction.guildId },
                    { $set: { accessRole: role.id } }
                );
            
            await interaction.reply({
                content: `✅ Set <@&${role.id}> as a general access role.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};

export default command;