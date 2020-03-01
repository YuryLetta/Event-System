let mongoose = require("mongoose");
let eventSchema = new mongoose.Schema({
    _id: Number,
    title : {type:String,required:true},
    eventdate :Date,
    mainSpeaker : {type:Number,ref:"speakers"},
    otherSpeakers :[{type:Number,ref:"speakers"}]
});
mongoose.model("events", eventSchema);