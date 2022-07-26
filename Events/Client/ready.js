const { Client } = require("discord.js"); 
const mongoose = require("mongoose");
require('dotenv').config();
module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        console.log("The Client is now ready!"); 
        client.user.setActivity("Hentai!", {type: "WATCHING"});

        const Database = process.env.Database;
      
        if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("The client is now connected to the Database!")
        }).catch((err) => {
            console.log(err)
        })
    } 
}