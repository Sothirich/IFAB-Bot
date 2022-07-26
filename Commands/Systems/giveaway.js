const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "giveaway",
    description: "A complete giveaway system.",
    permission: "ADMINISTRATOR",
    options:[
        {
            name: "start",
            description: "Start a giveaway.",
            type: "SUB_COMMAND",
            options:[
                {
                    name: "duration",
                    description: "Provide a duration for this giveaway (1m, 1h, 1d).",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "winners",
                    description: "Select the amount of winners for this giveaway.",
                    type: "INTEGER",
                    required: true,
                },
                {
                    name: "prize",
                    description: "Provide the name of the prize.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "channel",
                    description: "Select a channel to send this giveaway to.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"], 
                }
            ],
        },
        {
            name: "actions",
            description: "Option for giveaways.",
            type: "SUB_COMMAND",
            options:[
                {
                    name: "options",
                    description: "Select an option.",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "end",
                            value: "end"
                        },
                        {
                            name: "pause",
                            value: "pause"
                        },
                        {
                            name: "unpause",
                            value: "unpause"
                        },
                        {
                            name: "reroll",
                            value: "reroll"
                        },
                        {
                            name: "delete",
                            value: "delete"
                        }
                    ],
                },
                {
                    name: "message-id",
                    description: "Provide the message ID of the giveaway.",
                    type: "STRING",
                    required: true,
                }
            ],
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const {options} = interaction;

        const Sub = options.getSubcommand();

        const errorEmbed = new MessageEmbed()
        errorEmbed.setColor("RANDOM");

        const successEmbed = new MessageEmbed()
        successEmbed.setColor("RANDOM");

        switch(Sub) {
            case "start": {
                const gChannel = options.getChannel("channel") || interaction.channel;
                const duration = options.getString("duration");
                const winnerCount = options.getInteger("winners");
                const prize = options.getString("prize");

                client.giveawaysManager.start(gChannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize
                }).then(async() => {
                    successEmbed.setDescription("Giveaway is successfully started.");
                    return interaction.reply({embeds: [successEmbed], ephemeral: true});
                }).catch((err) => {
                    errorEmbed.setDescription(`An ERROR has occurred.\n\`${err}\``);
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                })
            }
            break;
            case "actions": {
                const choice = options.getString("options");
                const messageId = options.getString("message-id");
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                // If no giveaway was found
                if (!giveaway) {
                    errorEmbed.setDescription(`Message ID: ${messageId} not found!`);
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                }

                switch (choice) {
                    case "end": {
                        client.giveawaysManager.end(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been ended.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`An ERROR has occurred.\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    case "pause": {
                        client.giveawaysManager.pause(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been paused.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`An ERROR has occurred.\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    case "unpause": {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been unpaused.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`An ERROR has occurred.\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    case "reroll": {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been rerolled.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`An ERROR has occurred.\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    case "delete": {
                        client.giveawaysManager.delete(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been deleted.");
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(`An ERROR has occurred.\n\`${err}\``);
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        });
                    }
                    break;   
                }
            }
            break;

            default: {
                console.log("ERROR in giveaway command.")
            }
        }
    }
}