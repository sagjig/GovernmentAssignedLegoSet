/**
 * @name index.js
 * @version 1.0.0
 * @description Main method for running this bot.
 * @author sagjig <sagjig@gmail.com>
 */

// Require node:fs, Node's native filesystem module
const fs = require("node:fs");
// Require node:path, Node's native path-utility module, which builds paths to files/dirs
const path = require("node:path");

// Let Client and Intents require discord.js
const { Client, Intents, Collection } = require("discord.js");
// Let token require auth.json 
const { token } = require("./auth.json");

// Create new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});

/**
 * Stuff for setting up dynamic commands from ./commands/...
 */
// From the client instance we created before:
// Create the property commands, and make it a new collection
// This allows us to access these commands through other files
client.commands = new Collection();

// Get the path to the commands directory path
const commandsDirectoryPath = path.join(__dirname, "commands");

// Return an array of ALL filenames in the directory, and filter it by only getting anything that ends with .js
const filesInCommandsDirectory = fs.readdirSync(commandsDirectoryPath).filter(file => file.endsWith(".js"));

// For every file in ./commands ...
for (const file of filesInCommandsDirectory){
    // ...set up the path to this specific file
    const filePath = path.join(commandsDirectoryPath, file);
    // ...get the command name
    const command = require(filePath);

    // ...and then create a new item in the collection, key = command name; value = exported module
    client.commands.set(command.data.name, command);
    // Log each set command, and the total count to go
    console.log("Set " + command.data.name + " [" + (1+filesInCommandsDirectory.indexOf(file)) + "/" + filesInCommandsDirectory.length + "]");
    
}

/**
 * Runtime code
 */
// Login to Discord using the token
console.log("Logging into Discord with token...");
client.login(token);

// Run this when client is ready
client.once('ready', () => {
    console.log("----------------------\nBot is online! [CTRL+C to kill]");
})

// On an interaction, create an asynchronous process (async-await)
client.on("interactionCreate", async interaction => {
    // If you get something that isn't a registered command, return null.
    if( !(interaction.isCommand() )) return null; 

     //Create a local variable commandName from interaction.commandName
    const commandName = client.commands.get(interaction.commandName)

    // If for whatever reason something gets passed in that isn't a command-name, after the initial check, return null.
    if (!commandName) return;

    try{
        await commandName.execute(interaction);
    }
    catch (error){
        console.error(error);
        await interaction.reply({content: "Error in command execution", ephemeral: true})
    }


});


