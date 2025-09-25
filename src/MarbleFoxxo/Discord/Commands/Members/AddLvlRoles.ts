import { Actions } from "@/MarbleFoxxo/DatabaseActions/Actions";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ErrorEmbed from "../../EmbedWrappers/ErrorEmbed";
import { LevelRoles } from "@/_Interfaces/LevelRoles";

const name = "add-lvl-role";
const description = "Add a role that will be assigned to a user when they reach the specified level.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option =>
            option
                .setName("lvl")
                .setDescription("The level the role will correspond to")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("The role to add")
                .setRequired(true)
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const lvl = interaction.options.getInteger("lvl")!;
        const role = interaction.options.getRole("role")!;

        await interaction.deferReply();

        // Create and push
        const lvlRole: LevelRoles = {
            lvl: lvl,
            roleID: role.id
        };

        const guildData = await Actions.pushLvlRole(interaction.guild, lvlRole);

        if (!guildData || !guildData.lvlRoles) {
            const error = await ErrorEmbed(
                "An error occurred inserting the level role!",
                "Please try again or contact an administrator.",
                [
                    { name: "Level", value: lvlRole.lvl.toString() },
                    { name: "Role", value: `${role}` },
                ]
            );
        
            await interaction.editReply({ embeds: [error] });

            return;
        }

        // Success
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("Success!")
            .setDescription("Level role added!")
            .addFields([
                { name: "Level", value: lvlRole.lvl.toString() },
                { name: "Role", value: `${role}` },
            ]);
    
        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;