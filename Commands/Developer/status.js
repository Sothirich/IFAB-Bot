const { Client, MessageEmbed } = require("discord.js");
const { Collection, connection } = require("mongoose");
require("../../Events/Client/ready");

module.exports = {
    name: "status",
    description: "Displays the status of  the client and Database Connection.",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const Response = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`**Client**: \`🟢 ONLINE\` = \`${client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
        **Database**: \`${switchTo(connection.readyState)}\``)

        interaction.reply({embeds: [Response]})
        .then(_msg => {setTimeout(() => interaction.deleteReply().catch(e=>console.log(e)), (10000))});
    }
}

function switchTo (value) {
    var status = " ";
    switch (value) {
        case 0: {
            status = `🔴 DISCONNECTED`
            break;
        }
        case 1: {
            status = `🟢 CONNECTED`
            break;
        }
        case 2: {
            status = `🟠 CONNECTING`
            break;
        }
        case 3: {
            status = `🟡 DISCONNECTING`
            break;
        }
    }

    return status;
}