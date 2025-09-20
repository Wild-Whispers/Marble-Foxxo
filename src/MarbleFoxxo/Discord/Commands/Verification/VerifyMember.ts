import { getMongo } from "@/lib/mongo";
import { ChatInputCommandInteraction, GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js";

const name = "verify";
const description = "Grant general or NSFW server access to a specific member.";

const command = {
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommand(subcommand => 
            subcommand
                .setName("general-access")
                .setDescription("Give the member general access to your server.")
                .addUserOption(option =>
                    option
                        .setName("member")
                        .setDescription("The user being given general server access.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("nsfw-access")
                .setDescription("Give the member NSFW to your server.")
                .addUserOption(option =>
                    option
                        .setName("member")
                        .setDescription("The user being given NSFW server access.")
                        .setRequired(true)
                )
        ),
            
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const member = interaction.options.getMember("member")! as GuildMember;
        const mongo = getMongo();
        const [guildData] = await mongo.database
            .collection("guilds")
            .find({ guildID: interaction.guildId })
            .toArray();
        const permittedRoles = guildData.permittedToVerify;
        const executingMember = interaction.member! as GuildMember;
        const hasPermittedRole = executingMember.roles.cache.some(role => permittedRoles.includes(role.id));

        if (!hasPermittedRole) {
            await interaction.reply({
                content: `❌ You don't have permission to use this command.`,
                flags: MessageFlags.Ephemeral
            });

            return;
        }

        // Get general access, and NSFW roles
        const generalRole = interaction.guild?.roles.cache.get(guildData.accessRole);
        const nsfwRole = interaction.guild?.roles.cache.get(guildData.nsfwRole);

        if (subcommand === "general-access") {
            if (!generalRole) {
                await interaction.reply({
                    content: `❌ Role <@&${guildData.accessRole}> doesn't exist!`,
                    flags: MessageFlags.Ephemeral
                });

                return;
            }

            // Give verified member the role
            member.roles.add(generalRole);
            
            await interaction.reply({
                content: `✅ ${member} is now granted general access to your server!`
            });
        }

        if (subcommand === "nsfw-access") {
            if (!nsfwRole) {
                await interaction.reply({
                    content: `❌ Role <@&${guildData.nsfwRole}> doesn't exist!`,
                    flags: MessageFlags.Ephemeral
                });

                return;
            }

            // Give verified member the role
            member.roles.add(nsfwRole);
            
            await interaction.reply({
                content: `✅ ${member} is now granted NSFW access to your server!`
            });
        }
    }
};

export default command;