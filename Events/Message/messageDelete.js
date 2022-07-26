const { MessageEmbed, Message, WebhookClient } = require("discord.js");

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

        new WebhookClient({url: "https://discord.com/api/webhooks/979785665300557824/S5h7KwcGpSDnaZMarExWtKAmxX9Ay15y7WLO3N5FW84hQEmACVwHUG_H14mOyLSXhxD8"}
        ).send({embeds: [Log]}).catch((err) => console.log(err));
    }
}