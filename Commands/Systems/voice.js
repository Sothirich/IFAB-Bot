const { CommandInteraction, MessageEmbed } = require("discord.js")
const DB = require("../../Structures/Schemas/SuggestDB");

module.exports = {
    name: 'voice',
    description: 'Control your own Channel',
    options: [
        {
            name: 'invite',
            description: 'Invite a friend to your channel.',
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'member',
                    type: "USER",
                    required: true,
                    description: "Select the member."
                },
            ]
        },
        {
            name: 'disallow',
            description: 'Remove someone access to the channel.',
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'member',
                    type: 'USER',
                    required: true,
                    description: "Select the member."
                },
            ]
        },
        {
            name: 'rename',
            description: 'Change the name of your Channel.',
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'name',
                    type: 'STRING',
                    required: true,
                    description: "Provide the name."
                },
            ]
        },
        {
            name: 'privacy',
            description: 'Set your channel privacy.',
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'mode',
                    type: 'STRING',
                    required: true,
                    description: "Private or Public",
                    choices: [
                        { name: 'Public', value: 'on' },
                        { name: 'Private', value: 'off' }
                    ]
                },
            ]
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const { options, member, guild } = interaction;

        const subCommand = options.getSubcommand();
        const voiceChannel = member.voice.channel;
        const ownedChannel = client.voiceGenerator.get(member.id);

        if (!voiceChannel)
            return interaction.reply({ content: "You're not in a voice Channel.", ephemeral: true });

        if (!ownedChannel || voiceChannel.id !== ownedChannel)
            return interaction.reply({ content: "You do not own any channel.", ephemeral: true });

        switch (subCommand) {
            case "rename": {
                const newName = options.getString("name");
                if (newName.length > 22 || newName.length < 1)
                    interaction.reply({ content: "Name cannot be exceed 22 Character", ephemeral: true });

                voiceChannel.edit({ name: newName });
                interaction.reply({ content: `Channel has been set to **${newName}**`, ephemeral: true });
            }
                break;
            case "invite": {
                const targetMember = options.getMember("member");
                voiceChannel.permissionOverwrites.edit(targetMember, { CONNECT: true });

                targetMember.send({
                    embeds: [new MessageEmbed()
                        .setTitle(`Invitation`)
                        .setColor('RANDOM')
                        .setDescription(`${member} has invited you to join <#${voiceChannel.id}>.`)
                    ]
                });
                interaction.reply({ content: `${targetMember} has been invited!`, ephemeral: true });
            }
                break;
            case "disallow": {
                const targetMember = options.getMember("member");
                voiceChannel.permissionOverwrites.edit(targetMember, { CONNECT: false });

                if (targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id) targetMember.voice.setChannel(null);
                interaction.reply({ content: `${targetMember} has been removed from this channel!`, ephemeral: true });
            }
                break;
            case "privacy": {
                const turnChoice = options.getString("mode");
                switch (turnChoice) {
                    case "on": {
                        voiceChannel.permissionOverwrites.edit(guild.id, { CONNECT: null });
                        interaction.reply({ content: `The channel is now Public.`, ephemeral: true });
                    }
                        break;
                    case "off": {
                        voiceChannel.permissionOverwrites.edit(guild.id, { CONNECT: false });
                        interaction.reply({ content: `The channel is now Private.`, ephemeral: true });
                    }
                        break;
                }
            }
                break;
        }
    }
}