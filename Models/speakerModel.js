let mongoose = require("mongoose");
let speakerSchema = new mongoose.Schema({
    _id: Number,
    fullname: String,
    username: String,
    password: String,
    address:{city: String,street: Number,building: Number}
});
mongoose.model("speakers", speakerSchema);