const { MessageEmbed, Message, WebhookClient } = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */

    execute(oldMessage, newMessage) {
        if (oldMessage.guildId != "652155794720292865") return;
        if (oldMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;

        const count = 1950;

        const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, count) + (newMessage.content.length > 1950 ? " ..." : "");

        const Log = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: newMessage.author.tag, iconURL: newMessage.author.avatarURL({dynamic: true, size: 512})})
        .setDescription(`**Edited** a [message](${newMessage.url}) in ${newMessage.channel}.
        **Before:** ${Original}
        **+After:** ${Edited}`.slice("0", "4096"))
        .setFooter({text: `ID: ${newMessage.author.id}`})
        .setTimestamp()

        new WebhookClient({url: process.env.messageWebhook}
        ).send({embeds: [Log]}).catch((err) => console.log(err));
    }
}