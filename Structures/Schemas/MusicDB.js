const { model, Schema } = require("mongoose");

module.exports = model("music", new Schema({
    GuildID: String,
    ChannelID: String,
    Music: String,
    RequestedBy: String
}))