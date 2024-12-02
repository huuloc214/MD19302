const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const comment = new Schema({
    commentID: {type: ObjectId},
    videoID: {type: String},
    channelID: {type: String},
    contnet: {type: String}

});
module.exports = mongoose.model.comment || mongoose.model("comment", comment);