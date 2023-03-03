const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});

const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();
client.voiceGenerator = new Collection();
require('dotenv').config();

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { getVoiceConnection } = require("@discordjs/voice");

client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    // emitAddListWhenCreatingQueue: false,
    youtubeCookie: process.env.Cookie,
    plugins: [
        new SpotifyPlugin({
            parallel: true,
            emitEventsAfterFetching: false,
            api: {
                clientId: process.env.SpotifyID,
                clientSecret: process.env.SpotifySecret,
            },
        }),
        new YtDlpPlugin({
            update: true
        }),
        new SoundCloudPlugin(),
    ],
    // youtubeCookie --> prevents ERRORCODE: "429"
    youtubeDL: true,
    updateYouTubeDL: true,
    customFilters: {
        "clear": "dynaudnorm=f=200",
        "lightbass": "bass=g=8,dynaudnorm=f=200",
        "heavybass": "bass=g=20,dynaudnorm=f=200",
        "bassboost": "bass=g=8,dynaudnorm=f=200",
        "custombassboost": "bass=g=1,dynaudnorm=f=200",
        "customspeed": "atempo=1.0",
        "purebass": "bass=g=20,dynaudnorm=f=200,asubboost",    
        "8d": "apulsator=hz=0.08",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "phaser": "aphaser=in_gain=0.4",
        "tremolo": "tremolo",
        "vibrato": "vibrato=f=6.5",
        "reverse": "areverse",
        "treble": "treble=g=5",
        "surrounding": "surround",
        "pulsator": "apulsator=hz=1",
        "subboost": "asubboost",
        "karaoke": "stereotools=mlev=0.03",
        "flanger": "flanger",
        "gate": "agate",
        "haas": "haas",
        "mcompand": "mcompand",
        "earrape": "bass=g=50",
    }
});
module.exports = client;

require("./Systems/giveawaySys")(client);

["Events", "Commands"].forEach (handler => {
    require(`./Structures/Handlers/${handler}`)(client, PG, Ascii);
})

client.login(process.env.Token);