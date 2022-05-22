const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { bricksetAPIKey } = require("../auth.json");
//const fetch = require("node-fetch");
const axios = require("axios").default;
//const cheerio = require("cheerio");
//const URLSearchParams = require("urlsearchparams");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_lego_set")
        .setDescription("Return LEGO set given a set-number.")
        .addIntegerOption(option =>
            option.setName("set_number")
                .setDescription("The set number to look up.")
                .setRequired(true)),

    async execute(interaction) {
        const set_number = interaction.options.getInteger("set_number")
        const embed = await lookUpAndReturnSet(set_number);
        return await interaction.reply({
            //embeds: [embedTest().setDescription("If you see this description, you can overload stuff here").setTitle("It worked!")],
            //content: set_number.toString() + " returned...", //remove this for this command, this is for the get by discrim
            embeds: [embed],
            //ephemeral: true //Debugging: disable this on deployment
        })
    },
    lookUpAndReturnSet,
};

// TODO: Genericize this method so it can work with sets, parts, and whatever other page followign that specific format
/**
 * Returns a Discord embed of a Brickset page, given a set-number
 * @param {*} set_number 
 */
async function lookUpAndReturnSet(set_number) {
    var response = null;
    const endpoint = "https://brickset.com/api/v3.asmx/getSets";



    const combo = endpoint + "?apiKey=" + bricksetAPIKey + "&userHash=" + "&params=%7B%22setNumber%22%3A%20%22" + set_number + "-1" + "%22%7D";

    response = await axios.get(combo);
    //response = await axios.get("https://pastebin.com/raw/0G6qpSw0"); //DEBUGGING

    if (response.data.matches == 0) {
        throw new Error("No set with that number");
    }

    if (response.data.status == "error") {
        throw new Error("Backend API error: " + response.data.message);
    }

    returned_set_title = getPropertyIfExists("number", response.data.sets[0]) + " " + getPropertyIfExists("name", response.data.sets[0]);
    returned_url = response.data.sets[0].bricksetURL;
    //returned_set_image_url = getPropertyIfExists("imageURL",response.data.sets[0].image);
     getImageIfExists = (response) => {
        if (getPropertyIfExists("imageURL", response.data.sets[0].image) !== "Property not found")
            return getPropertyIfExists("imageURL", response.data.sets[0].image);
        else
            return "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png";
    }
    returned_set_image_url = getImageIfExists(response);
    //returned_desc = response.data.sets[0].extendedData.notes;
    returned_desc = getPropertyIfExists("notes", response.data.sets[0].extendedData);

    returned_pieces = getPropertyIfExists("pieces", response.data.sets[0]);
    returned_year = getPropertyIfExists("year", response.data.sets[0]);
    returned_price = getPropertyIfExists("retailPrice", response.data.sets[0].LEGOCom.US);
    /**
     * create the embed message from gathered data
     */
    const myEmbed = new MessageEmbed()
        .setTitle(returned_set_title)
        .setDescription("Description: " + returned_desc)
        .addFields(
            { name: "Total pieces", value: returned_pieces.toString(), inline: true },
            { name: "Price (USD)", value: returned_price.toString(), inline: true },
            { name: "Year", value: returned_year.toString(), inline: true }
        )
        .setImage(returned_set_image_url)
        .setColor("#E3000B") // LEGO(tm) Red
        .setFooter({
            text: "Data from Brickset ltd.",
            iconURL: "https://brickset.com/favicon.ico"
        })
        .setURL(encodeURI(returned_url));

    return myEmbed;


}

/* function embedTest(){
    const myEmbed = new MessageEmbed()
    .setTitle("My Embed Title")
    .setThumbnail("https://static.macupdate.com/products/19742/m/lego-digital-designer-logo.webp?v=1619034141")

    return myEmbed;
} */

function getPropertyIfExists(prop, obj) {
    if (prop in obj) {
        return obj[prop];
    }
    return "(Property not found)";

}


/** This runs when running the script */
//console.log("Debugging for get_lego_set");
//const myEmbed = lookUpAndReturnSet(4444);