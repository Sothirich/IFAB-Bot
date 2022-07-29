const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    type: "USER", 
    context: true,
    //permission: "ADMINISTRATOR",
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: target.user.tag, iconURL: target.user.avatarURL({dynamic: true, size: 512})})
        .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
        .addFields(
            {
                name: "ID",
                value: `${target.user.id}`
            },
            {
                name: "Roles",
                value: `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`
            },
            {
                name: "Member Since",
                value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
                inline: true
            },
            {
                name: "Discord User Since",
                value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
                inline: true
            },
        )
        
        interaction.reply({embeds: [Response], ephemeral: true})
    }
}