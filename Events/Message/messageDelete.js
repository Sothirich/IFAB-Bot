const { MessageEmbed, Message, WebhookClient } = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message 
     */

    execute(message) {
        if (message.guildId != "652155794720292865") return;

        if (message.author.bot) return;

        const Log = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({dynamic: true, size: 512})})
        .setDescription(`**Deleted** a [message](${message.url}) in ${message.channel}.\n
        ${message.content ? message.content : "None"}`)
        .setFooter({text: `ID: ${message.author.id}`})
        .setTimestamp()

        if (message.attachments.size >= 1) {
            Log.addField(`Attachments:`, `${message.attachments.map(a => a.url)}`, true)
        }

        new WebhookClient({url: process.env.messageWebhook}
        ).send({embeds: [Log]}).catch((err) => console.log(err));
    }
}