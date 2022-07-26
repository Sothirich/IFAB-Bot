const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "ServerInfo",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { guild } = interaction;

        const { createdTimestamp, ownerId, description, members, memberCount, channels, emojis, stickers } = guild;

        const Embed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(guild.name, guild.iconURL({dynamic: true}))
        .setThumbnail(guild.iconURL({dynamic: true}))
        .addFields(
            {
                name: "GENERAL",
                value:
                `
                name: ${guild.name}
                Created: <t:${parseInt(createdTimestamp / 1000)}:R>
                Owner: <@${ownerId}>

                Description: ${description}
            
                
                
                `
            },
            {
                name: "📍 | USERS",
                value:
                `
                - Members: ${members.cache.filter((m) => !m.user.bot).size}
                - Bots: ${members.cache.filter((m) => m.user.bot).size}
                
                Total: ${memberCount}
                `
            },
            {
                name: "📘 | CHANNELS",
                value:
                `
                - Text: ${channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                - voice: ${channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                - Threads: ${channels.cache.filter((c) => c.type === "GUILD_NEWS_THREAD" && "GUILD_PRIVATE_THREAD" && "GUILD_PUBLIC_THREAD").size}
                - Categories: ${channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                - Stages: ${channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE").size}
                - News: ${channels.cache.filter((c) => c.type === "GUILD_NEWS").size}
                
                Total: ${channels.cache.size}
                `
            },
            {
                name: "🎯 | EMOJIS & STICKERS",
                value:
                `
                - Animated: ${emojis.cache.filter((e) => e.animated).size}
                - Static: ${emojis.cache.filter((e) => !e.animated).size}
                - Stickers: ${stickers.cache.size}

                - Total: ${stickers.cache.size + emojis.cache.size}
                
                `
            }
        )

        interaction.reply({embeds: [Embed]})
    }
}