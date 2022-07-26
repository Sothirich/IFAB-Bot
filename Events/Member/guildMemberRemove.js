const { MessageEmbed, GuildMember, WebhookClient } = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        const { user, guild } = member;
        
        if (guild.id != "652155794720292865") return;
        
        const Leave = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: user.tag, iconURL: user.avatarURL({dynamic: true, size: 512})})
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        ${member} has left the community!\n
        Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\n
        Latest Member Count: **${guild.memberCount}**`)
        .setFooter({text: `ID: ${user.id}`})
        .setTimestamp()

        new WebhookClient({url: process.env.welcomeWebhook}
        ).send({embeds: [Leave]}).catch((err) => console.log(err));
    }
}