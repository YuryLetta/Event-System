const express = require("express");
const speakersActionsRouter = express.Router();
let mongoose = require("mongoose");
require("../Models/speakerModel");
let SpeakerModel = mongoose.model("speakers");
require("../Models/eventModel");
let eventModel = mongoose.model("events");

/************************************************** */
speakersActionsRouter.use((request, response, next) => {
    if (request.session.role == "speaker") {
        next();
    } else {
        response.redirect("/login");
    }
});
speakersActionsRouter.get("/profile", (request, response) => {
    // console.log(" inside profile speaker get", request.session);
    SpeakerModel.find({
        _id: request.session._id
    }).then((data) => {
        response.render("speakers/speakerProfile", {
            userData: data
        });
    }).catch((err) => {
        response.send(" " + err);
    });
});
speakersActionsRouter.post("/updateProfile", (request, response) => {
    SpeakerModel.update({
        _id: request.session._id
    }, {
        $set: {
            fullname: request.body.fullname,
            "address.city": request.body.city,
            "address.street": request.body.street,
            "address.building": request.body.building
        }
    }).then((data) => {
        request.session.name = request.body.fullname;
        return response.redirect("/speakers/profile");
    }).catch((err) => {
        response.send(" " + err);
    });
});
speakersActionsRouter.get("/currentEvents", (request, response) => {
    eventModel.find({
        $or: [{
            mainSpeaker: request.session._id
        }, {
            otherSpeaker: request.session._id
        }]
    }).populate({
        path: "mainSpeaker otherSpeakers"
    }).then((data) => {
        response.render("events/speakerCurrentEvents", {
            eventData: data
        });
    }).catch((err) => {
        console.log(err);
    });

});
module.exports = speakersActionsRouter;