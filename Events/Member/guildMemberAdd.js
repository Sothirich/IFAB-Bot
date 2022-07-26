const { MessageEmbed, GuildMember, WebhookClient } = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        const { user, guild } = member;
        //member.roles.add("877563130421579817")
        if (guild.id != "652155794720292865") return;
        
        const Welcome = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: user.tag, iconURL: user.avatarURL({dynamic: true, size: 512})})
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        Welcome ${member} to the **${guild.name}**!\n
        Account Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\n
        Latest Member Count: **${guild.memberCount}**`)
        .setFooter({text: `ID: ${user.id}`})
        .setTimestamp()

        new WebhookClient({url: process.env.welcomeWebhook}
        ).send({embeds: [Welcome]}).catch((err) => console.log(err));
    }
}