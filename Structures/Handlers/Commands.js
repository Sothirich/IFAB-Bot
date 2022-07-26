const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");
/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Command Loaded");

    CommandsArray = [];

    (await PG(`${(process.cwd().replace(/\\/g,  "/"))}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name) 
        return Table.addRow(file.split("/")[7], "⚠ Failed", "Missing a name.") 

        if (!command.context && !command.type && !command.description) 
        return Table.addRow(command.name, "⚠ Failed", "Missing a description.")

        if (command.permission) {
            if (Perms.includes(command.permission)) {
                command.defaultPermission = false;
            } else {
                return Table.addRow(command.name, "⚠ Failed", "Permission is invalid.")
            }
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "✔ SUCCESSFUL");
    });

    console.log(Table.toString());

    // PERMISSION CHECK //
    client.on("ready", async () => {
        client.guilds.cache.forEach((MainGuild) => {
            MainGuild.commands.set(CommandsArray)
        })
        // const MainGuild = await client.guilds.cache.get("856438675943194674");

        // MainGuild.commands.set(CommandsArray)
    })
}