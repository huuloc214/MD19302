const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OjectId = Schema.ObjectId;
const student = new Schema({
    id: {type:OjectId},
    MSSV:{type:String},
    BM:{type:String},
    TenHocSinh:{type:String},
    Tuoi:{type:Number},
    Diem:{type:Number}
});
module.exports = mongoose.model.student || mongoose.model("student", student);