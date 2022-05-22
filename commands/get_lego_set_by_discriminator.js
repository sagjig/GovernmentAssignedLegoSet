const { SlashCommandBuilder } = require("@discordjs/builders");
var getLegoSet = require("./get_lego_set");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_lego_set_by_discriminator")
        .setDescription("Return the LEGO set associated with an account discriminator.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The account to pull the discriminator from.")
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const embed = await getLegoSet.lookUpAndReturnSet(user.discriminator);
        return await interaction.reply({
            content: "Your government-assigned LEGO set is...", //remove this for this command, this is for the get by discrim
            embeds: [embed],
            //ephemeral: true //Debugging: disable this on deployment
        })
    },
};