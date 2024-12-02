const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OjectId = Schema.ObjectId;
const users = new Schema({
    id: {type:OjectId},
    username: {type:String},
    password: {type:String},
    fullname: {type:String}
});
module.exports = mongoose.model.users || mongoose.model("users", users);