const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_lego_set")
        .setDescription("Return LEGO set given a set-number.")
        .addIntegerOption(option =>
            option.setName("set_number")
            .setDescription("The set number to look up.")
            .setRequired(true)),
            
    async execute(interaction){
        // TODO: Return an embed message as a response
        const set_number = interaction.options.getInteger
        return await interaction.reply({
            embeds: [embedTest()],
            ephemeral: true //Debugging: disable this on deployment
        })
    },
};

// TODO: Pull HTML page and embed stuff you need in it so it can be returned to the execution process.
// TODO: Genericize this method so it can work with sets, parts, and whatever other page followign that specific format
/**
 * Returns a Discord embed of a Brickset page, given a set-number
 * @param {*} set_number 
 */
function lookUpAndReturnSet(set_number){
    fetch("https://brickset.com/sets/"+set_number).then(function (response){
        // Successfully returned the Brickset page
        console.log("Sucessfully pulled HTML page for " + response)
    }).catch(function (err){
        // Error in returning page
        console.error("Could not return Brickset HTML page")
    })
}

function embedTest(){
    const myEmbed = new MessageEmbed()
    .setTitle("My Embed Title")
    .setThumbnail("https://static.macupdate.com/products/19742/m/lego-digital-designer-logo.webp?v=1619034141")

    return myEmbed;
}