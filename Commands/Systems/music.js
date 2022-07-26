const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const DB = require("../../Structures/Schemas/MusicDB")

module.exports = {
    name: "music",
    description: "Complete music system",
    options: [
        {
            name: "play",
            description: "Play a song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "song",
                    description: "Provide a name or URL of the song.",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "forceplay",
            description: "Play the song immediately without skipping songs",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "song",
                    description: "Provide a name or URL of the song.",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "playnext",
            description: "Queue the song after the current song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "song",
                    description: "Provide a name or URL of the song.",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "volume",
            description: "Alter the volume.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "percent",
                    description: "10 = 10%",
                    type: "NUMBER",
                    required: true,
                }
            ]
        },
        {
            name: "queue",
            description: "Show music queue.",
            type: "SUB_COMMAND"
        },
        {
            name: "skip",
            description: "Skip currently playing song.",
            type: "SUB_COMMAND"
        },
        {
            name: "clear",
            description: "Clear the queue.",
            type: "SUB_COMMAND"
        },
        {
            name: "shuffle",
            description: "Shuffle the queue.",
            type: "SUB_COMMAND"
        },
        {
            name: "pause",
            description: "Pause currently playing song.",
            type: "SUB_COMMAND"
        },
        {
            name: "resume",
            description: "Resume currently playing song.",
            type: "SUB_COMMAND"
        },
        {
            name: "relatedsong",
            description: "Add a Related Song.",
            type: "SUB_COMMAND"
        },
        {
            name: "jump",
            description: "Jump to specific position.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "position",
                    description: "Provide the position of the song.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "loop",
            description: "Toggle loop mode.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "mode",
                    description: "Provide loop mode.",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "disable", value: "0" },
                        { name: "song", value: "1" },
                        { name: "queue", value: "2" }
                    ]
                }
            ]
        },
        {
            name: "autoplay",
            description: "Toggle autoplay mode.",
            type: "SUB_COMMAND"
        },
        {
            name: "remove",
            description: "Remove specific song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "index",
                    description: "Provide the position of the song.",
                    type: "NUMBER",
                    required: true
                },
                {
                    name: "toindex",
                    description: "Provide the last position of the song you want to remove.",
                    type: "NUMBER",
                },
            ]
        },
        {
            name: "move",
            description: "Move specific song to specific position.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "fromindex",
                    description: "Provide the index of the song.",
                    type: "NUMBER",
                    required: true
                },
                {
                    name: "toindex",
                    description: "Provide the index you want to move to. (1 == after current, -1 == Top)",
                    type: "NUMBER",
                    required: true
                },
            ]
        },
        {
            name: "lyrics",
            description: "Get song lyrics",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "title",
                    description: "Provide the title of the song.",
                    type: "STRING",
                    required: false
                }
            ]
        },
        {
            name: "nowplaying",
            description: "Show info of the current song.",
            type: "SUB_COMMAND"
        },
        {
            name: "filter",
            description: "Set the song filter.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "type",
                    description: "Provide filter type.",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "clear", value: "clear" },
                        { name: "lightbass", value: "lightbass" },
                        { name: "heavybass", value: "heavybass" },
                        { name: "bassboost", value: "bassboost" },
                        { name: "custombassboost", value: "custombassboost" },
                        { name: "customspeed", value: "customspeed" },
                        { name: "purebass", value: "purebass" },
                        { name: "8d", value: "8d" },
                        { name: "vaporwave", value: "vaporwave" },
                        { name: "nightcore", value: "nightcore" },
                        { name: "phaser", value: "phaser" },
                        { name: "tremolo", value: "tremolo" },
                        { name: "vibrato", value: "vibrato" },
                        { name: "reverse", value: "reverse" },
                        { name: "treble", value: "treble" },
                        { name: "surrounding", value: "surrounding" },
                        { name: "pulsator", value: "pulsator" },
                        { name: "subboost", value: "subboost" },
                        { name: "karaoke", value: "karaoke" },
                        { name: "flanger", value: "flanger" },
                        { name: "gate", value: "gate" },
                        { name: "haas", value: "haas" },
                        { name: "mcompand", value: "mcompand" },
                        { name: "earrape", value: "earrape" },
                        { name: "reset", value: "reset" },
                    ]
                }
            ]
        },
        {
            name: "leave",
            description: "Disconnect the bot",
            type: "SUB_COMMAND"
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;

        const menu = options.getSubcommand();

        if (!voiceChannel)
            return interaction.reply({ content: "You must be in a voice channel to use music commands.", ephemeral: true });

        if (guild.me.voice.channelId && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({ content: `I'm already in <#${guild.me.voice.channelId}>`, ephemeral: true });

        const queue = await client.distube.getQueue(voiceChannel);

        if (menu !== "lyrics" && menu !== "play" && menu !== "forceplay" && menu !== "playnext" && menu !== "leave" && !queue)
            return interaction.reply({ content: "There is no queue.", ephemeral: true });

        // if (menu == "skip" || menu == "clear" || menu == "jump" || menu == "forceplay") {
        //     channel.messages.fetch({ limit: 5 }).then(messages => {
        //         let lastMessage = messages.first();

        //         if (lastMessage.author.bot) 
        //         lastMessage.delete().catch();
        //     })
        // }

        try {
            switch (menu) {
                case "play": {
                    client.distube.play(voiceChannel, options.getString("song"), { textChannel: channel, member: member });

                    // await DB.create(
                    //     {GuildID: guild.id, ChannelID: voiceChannel.id},
                    //     {Music}
                    // )
                    return interaction.reply({ content: "Searching..." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 3000) });
                }
                case "volume": {
                    const Volume = options.getNumber("percent");
                    if (Volume > 100 || Volume < 1)
                        return interaction.reply({ content: "You have to specify between 1-100.", ephemeral: true });

                    client.distube.setVolume(voiceChannel, Volume);
                    return interaction.reply({ content: `Volume has been set to \`${Volume}%\`` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 5000) });
                }
                case "queue": {
                    let currentPage = 0;
                    let length = queue.songs.length - 1;

                    let lastPage = 0;
                    if (length % 10 == 0) lastPage = Math.floor(length / 10);
                    else lastPage = (Math.floor(length / 10) + 1);

                    if (length == 0) {
                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`🎶 Queue: 0`)
                                .setColor("RANDOM")
                                .setDescription(`__Now Playing:__\n${queue.songs.map(song => `**[${song.name}](${song.url})** | \`${song.formattedDuration}\` | \`Requested By: ${song.user.tag}\``).slice(0, 1).join("\n")}\n\nPage: 0`)
                            ]
                        }).then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 30 * 1000) });
                    }

                    const embeds = [];
                    let k = 0;
                    for (let i = 0; i < queue.songs.length; i += 10) {
                        k += 10;
                        const info = queue.songs.map((song, id) => `**${id}**. **[${song.name}](${song.url})** | \`${song.formattedDuration}\` | \`Requested By: ${song.user.tag}\``).slice(i + 1, k + 1).join("\n");
                        const embed = new MessageEmbed()
                            .setTitle(`🎶 Queue: ${queue.songs.length - 1}`)
                            .setColor("RANDOM")
                            .setDescription(`__Now Playing:__\n${queue.songs.map(song => `**[${song.name}](${song.url})** | \`${song.formattedDuration}\` | \`Requested By: ${song.user.tag}\``).slice(0, 1).join("\n")}\n\n__Up Next:__\n${info}\n\nPage: ${k/10} of ${lastPage}`)

                        embeds.push(embed);
                    }
                    const emojis = ['⏮️', '⏭️'];
                    return interaction.reply({ embeds: [embeds[currentPage]], fetchReply: true })
                        .then(async message => {
                            setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 60 * 1000);

                            for (const emoji of emojis)
                                await message.react(emoji);

                            const collector = message.createReactionCollector((reaction) => {
                                emojis.includes(reaction.emoji.name)
                            });

                            collector.on('collect', (reaction, user) => {
                                reaction.users.remove(user.id);

                                function selectEmbed(emoji) {
                                    switch (emoji) {
                                        case '⏮️': {
                                            if (currentPage == 0) currentPage = lastPage - 1;
                                            else currentPage--;
                                            return embeds[currentPage];
                                        }
                                        break;
                                        case '⏭️': {
                                            if (currentPage == lastPage - 1) currentPage = 0;
                                            else currentPage++;
                                            return embeds[currentPage];
                                        }
                                        break;
                                    }
                                }

                                return interaction.editReply({ embeds: [selectEmbed(reaction.emoji.name)], fetchReply: true });
                            })
                        })
                }
                case "skip": {
                    client.distube.skip(voiceChannel);
                    return interaction.reply({ content: "⏩ Song has been skipped." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(), 10000) });
                }
                case "pause": {
                    client.distube.pause(voiceChannel);
                    return interaction.reply({ content: "⏸ Song has been paused." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "resume": {
                    client.distube.resume(voiceChannel);
                    return interaction.reply({ content: "⏯ Song has been resumed." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "clear": {
                    client.distube.stop(voiceChannel)
                    return interaction.reply({ content: `⏹ Cleared the Queue.` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "shuffle": {
                    client.distube.shuffle(voiceChannel);
                    return interaction.reply({ content: "🔀 Song has been shuffled." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "relatedsong": {
                    await client.distube.addRelatedSong(voiceChannel);
                    return interaction.reply({ content: `🔄 **${queue.songs[queue.songs.length - 1].name}** has been added.` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "jump": {
                    let position = options.getNumber("position");

                    if (position > queue.songs.length - 1) position = queue.songs.length - 1;

                    if (position <= 0)
                        return interaction.reply({ content: `⚠ You can only jump from 1 on...` })

                    let song = queue.songs[position];
                    await queue.jump(position);
                    return interaction.reply({ content: `*️⃣ Jumped successfully.\n Loaded: **${song.name}**` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "loop": {
                    let Mode2 = options.getString("mode");
                    await client.distube.setRepeatMode(guild, parseInt(Mode2));

                    return interaction.reply({ content: `🔁 Loop is set to **${Mode2 == 1 ? "Song-Loop" : Mode2 == 2 ? "Queue-Loop" : "Off"}**` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "autoplay": {
                    let Mode = await queue.toggleAutoplay(voiceChannel);
                    return interaction.reply({ content: `🔂 Autoplay is set to ${Mode ? "On" : "Off"}` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "remove": {
                    let index = options.getNumber("index");
                    let lastIndex = options.getNumber("toindex");

                    if (lastIndex && lastIndex < index)
                        return interaction.reply({ content: "You need to remove at least 1 song.", ephemeral: true });

                    if (index <= 0)
                        return interaction.reply({ content: "You can't remove the current song.", ephemeral: true });

                    if (lastIndex > queue.songs.length - 1) lastIndex = queue.songs.length - 1;

                    let amount = lastIndex - index + 1;

                    if (amount > 1) {
                        queue.songs.splice(index, amount);
                        return interaction.reply({ content: `🔽 Successfully removed ${amount} song${amount > 1 ? "s" : ""}.` })
                            .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                    } else {
                        amount = 1;
                        let song = queue.songs[index];
                        queue.songs.splice(index, amount);
                        return interaction.reply({ content: `🔽 Successfully removed **${song.name}**.` })
                            .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                    }
                }
                case "move": {
                    let index = options.getNumber("fromindex");
                    let newIndex = options.getNumber("toindex");

                    if (newIndex >= queue.songs.length || newIndex < 0) newIndex = -1;

                    if (index > queue.songs.length - 1)
                        return interaction.reply({ content: "This Song does not exist!", ephemeral: true });

                    if (newIndex == 0)
                        return interaction.reply({ content: "Cannot move the current song!", ephemeral: true });

                    let song = queue.songs[index];
                    queue.songs.splice(index, 1);
                    queue.addToQueue(song, newIndex);
                    return interaction.reply({ content: `🔽 Successfully moved **${song.name}** to the **\`${newIndex}th\`** Place right after **_${queue.songs[newIndex - 1].name}_!**` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "lyrics": {
                    var songTitle = options.getString("title")

                    if (songTitle) {
                        let lyrics = await require('lyrics-finder')("", songTitle) || "none";

                        if (lyrics === `none`)
                            return interaction.reply({ content: `Lyrics not found...`, ephemeral: true })

                        return interaction.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`${songTitle} - Lyrics`)
                                .setColor('RANDOM')
                                .setDescription(lyrics)
                            ]
                        }).then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 120000) });
                    }

                    if (!guild.me.voice.channelId && !queue)
                        return interaction.reply({ content: `There's no song playing in the queue.`, ephemeral: true });

                    let currentsong = queue.songs[0];
                    let lyrics = await require('lyrics-finder')("", currentsong.name.toLowerCase().replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace("music", "").replace("audio", "").replace("official", "").replace("lyrics", "").replace("lyrics", "").replace("video", "").replace("mv", "").replace("slowed", "").replace("reverb", "").replace("+", "")) || "none";

                    if (lyrics === `none`)
                        return interaction.reply({ content: `Lyrics not found...`, ephemeral: true })

                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${currentsong.name}`)
                            .setURL(currentsong.url)
                            .setColor("RANDOM")
                            .setThumbnail(currentsong.thumbnail)
                            .setDescription(lyrics)
                        ]
                    }).then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), (120 * 1000)) });
                }
                case "nowplaying": {
                    let currentsong = queue.songs[0];
                    const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
                    const status1 = queue => `Requested by: **${currentsong.user}** | Duration: \`${queue.formattedCurrentTime} / ${currentsong.formattedDuration}\``;

                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`${currentsong.name}`)
                            .setURL(currentsong.url)
                            .setColor("RANDOM")
                            .addField("QueueStatus", status(queue))
                            .addField("SongStatus", status1(queue))
                            .addField(`Download Song:`, `>>> [\`Click here\`](${currentsong.streamURL})`, true)
                            .setThumbnail(currentsong.thumbnail)
                            .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                        ]
                    }).then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), ((currentsong.duration - queue.currentTime) * 1000)) });
                }
                case "forceplay": {
                    client.distube.play(voiceChannel, options.getString("song"), { textChannel: channel, member: member, skip: true });
                    return interaction.reply({ content: "Searching..." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 3000) });
                }
                case "filter": {
                    let type = options.getString("type");

                    if (type === 'reset') {
                        client.distube.setFilter(queue, false);
                    } else {
                        client.distube.setFilter(queue, false);
                        client.distube.setFilter(queue, type);
                    }

                    return interaction.reply({ content: `🔁 Filter is set to **${options.getString("type")}**` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "leave": {
                    if (!guild.me.voice.channel)
                        return interaction.reply({ content: `I'm not in the channel. So how can you kick me?!`, ephemeral: true });

                    client.distube.voices.leave(queue);

                    return interaction.reply({ content: `Leaving the <#${guild.me.voice.channelId}>` })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 10000) });
                }
                case "playnext": {
                    client.distube.play(voiceChannel, options.getString("song"), { textChannel: channel, member: member, position: 1 });
                    return interaction.reply({ content: "Searching..." })
                        .then(_msg => { setTimeout(() => interaction.deleteReply().catch(e => console.log(e)), 3000) });
                }
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`⛔ Alert: ${e}`)
            return interaction.reply({ embeds: [errorEmbed] });
        }
    }
}