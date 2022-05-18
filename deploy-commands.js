// Get SlashCommandBuilder from discordjs/builders
const {SlashCommandBuilder} = require("@discordjs/builders");

const { REST } = require("@discordjs/rest");

const { Routes } = require("discord-api-types/v10")

const {client_id, guild_id, token} = require("./auth.json");

const commands = [
    new SlashCommandBuilder().setName("get_lego_set"),
    new SlashCommandBuilder().setName("get_lego_set_by_discriminator")
]
    .map(command => command.toJSON());

const rest = new REST({version: '10'}).setToken(token); 

rest.put(Routes.applicationGuildCommands(client_id, guild_id), {body: commands}) //register all application commands
.then(() => console.log("Registered application commands"))
.catch(console.error); //for error-handling