// Get SlashCommandBuilder from discordjs/builders
const {SlashCommandBuilder} = require("@discordjs/builders");

const { REST } = require("@discordjs/rest");

const { Routes } = require("discord-api-types/v10")

const {client_id, guild_id, token} = require("./auth.json");


// Require node:fs, Node's native filesystem module
const fs = require("node:fs");
// Require node:path, Node's native path-utility module, which builds paths to files/dirs
const path = require("node:path");

/**
 * Dynamically add commands from ./commands/...
 */
//Array of commands - these MUST also have descriptions
const commands = [
    // DEPRECATED: These fields used to be how I set each command up, but it's better to dynamically set them from the commands folder.
    // Now the array is just initialized to be blank, i.e. const commands = [];

    //new SlashCommandBuilder().setName("get_lego_set").setDescription("Return LEGO set given the set-number."),
    //new SlashCommandBuilder().setName("get_lego_set_by_discriminator").setDescription("Return LEGO set using the user discriminator as a set-number.")
];
//commands.map(command => command.toJSON() ); // DEPCREATED: shorthand for converting each command in commands to a JSON version

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

    // and push it in a JSON form
    commands.push(command.data.toJSON() );
    // Log each registered command, and the total count to go
    console.log("Registered " + command.data.name + " [" + (1+filesInCommandsDirectory.indexOf(file)) + "/" + filesInCommandsDirectory.length + "]");
    

}


const rest = new REST({version: '10'}).setToken(token); 

rest.put(Routes.applicationGuildCommands(client_id, guild_id), {body: commands}) //register all application commands
.then(() => console.log("\nRegistered all application commands")) //Then, log it to the console
.catch(console.error); //...and catch any errors