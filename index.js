/**
 * index.js
 * by sagjig, 17 May 2022
 */

// Let Client and Intents require discord.js
const { Client, Intents } = require("discord.js");
// Let token require auth.json 
const { token } = require("./auth.json");

// Create new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});

// Login to Discord using the token
console.log("Logging in...");
client.login(token);

// Run this when client is ready
client.once('ready', () => {
    console.log("Client is ready");
})