const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_lego_set")
        .setDescription("Return LEGO set given a set-number."),
    async execute(interaction){
        // TODO: Return an embed message as a response
        await interaction.reply("Test response")
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