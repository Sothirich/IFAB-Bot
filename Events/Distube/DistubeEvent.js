const client = require("../../index");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "DistubeEvents",
};

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
    .on('playSong', (queue, song) => queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setTitle("Playing :notes: " + song.name)
            .setURL(song.url)
            .setColor("RANDOM")
            .addFields(
                {
                    name: "Duration",
                    value: `\`${song.formattedDuration}\``
                },
                {
                    name: "QueueStatus",
                    value: `${status(queue)}`
                },
            )
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Requested by: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), (song.duration + "000")) })
    )

    .on('addSong', (queue, song) => queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setTitle("Added :thumbsup: " + song.name)
            .setURL(song.url)
            .setColor("RANDOM")
            .addFields(
                {
                    name: `${queue.songs.length - 1} Songs in the Queue`,
                    value: `Duration: \`${queue.formattedDuration}\``
                },
                {
                    name: "Duration",
                    value: `\`${song.formattedDuration}\``
                },
            )
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Requested by: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 10000) })
    )

    .on("playList", (queue, playlist, song) => queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setTitle("Playing Playlist :notes: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
            .setURL(playlist.url)
            .setColor("RANDOM")
            .addFields(
                {
                    name: "Current Track:",
                    value: `[${song.name}](${song.url})`
                },
                {
                    name: "Duration",
                    value: `\`${playlist.formattedDuration}\``
                },
                {
                    name: `${queue.songs.length} Songs in the Queue`,
                    value: `Duration: \`${format(queue.duration * 1000)}\``
                },
            )
            .setThumbnail(playlist.thumbnail.url)
            .setFooter({ text: `Requested by: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), (song.duration + "000")) })
    )

    .on('addList', (queue, playlist) => queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setTitle("Added Playlist :thumbsup: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
            .setURL(playlist.url)
            .setColor("RANDOM")
            .addFields(
                {
                    name: "Duration",
                    value: `\`${playlist.formattedDuration}\``
                },
                {
                    name: `${queue.songs.length - 1} Songs in the Queue`,
                    value: `Duration: \`${queue.formattedDuration}\``
                },
            )
            .setThumbnail(playlist.thumbnail.url)
        ]
    }).then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 20000) })
    )

    .on('error', (channel, e) => {
        channel.send(`🛑 An ERROR encountered:\n ${e.toString().slice(0, 1974)}`)
        console.error(e)
    })

    .on('empty', queue => queue.textChannel.send('Voice channel is empty! Leaving the channel...')
        .then(msg => { setTimeout(() => msg.delete().catch(e => console.log(e)), 5000) })
    )

    // .on('searchNoResult', (message, query) => message.channel.send(`| No result found for \`${query}\`!`))

    // .on('finish', queue => queue.textChannel.send('Finished!'))

    .on("initQueue", queue => {
        queue.autoplay = true;
        queue.volume = 100;
    })