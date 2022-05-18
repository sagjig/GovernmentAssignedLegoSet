const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("returns pong!"),

    async execute(interaction){
        return await interaction.reply({
            content: "pong!",
            ephemeral: true //make it ephemeral so we don't flood the chat with PONGs
        });
    }

}