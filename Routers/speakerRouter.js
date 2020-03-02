const express = require("express");
const speakerRouter = express.Router();
let mongoose = require("mongoose");
require("../Models/speakerModel");
let SpeakerModel = mongoose.model("speakers");
require("../Models/eventModel");
let eventModel = mongoose.model("events");

/************************************************** */
speakerRouter.use((request, response, next) => {
    if (request.session.role == "speaker") {
        speakerRouter.get("/profile", (request, response) => {
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
        speakerRouter.post("/updateProfile", (request, response) => {
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
                response.redirect("/speakers/profile");
            }).catch((err) => {
                response.send(" " + err);
            });
        });
        speakerRouter.get("/currentEvents", (request, response) => {
            eventModel.find({}).populate({
                path: "mainSpeaker otherSpeakers"
            }).then((data) => {
                response.render("events/speakerCurrentEvents", {
                    eventData: data
                })
            }).catch((err) => {
                response.send(" " + err);
            });
        });
        next();
    } else if (request.session.role == "admin") {
        speakerRouter.get("/add", (request, response) => {
            response.render("speakers/addSpeaker");
        })
        speakerRouter.post("/add", (request, response) => {
            let newSpeaker = new SpeakerModel(request.body);
            newSpeaker.save().then((data) => {
                response.redirect("/speakers/list");
            }).catch((err) => {
                response.send(" " + err);
            });
        })
        speakerRouter.get("/edit/:_id", (request, response) => {
            // console.log(request.params._id);
            SpeakerModel.find({
                _id: request.params._id
            }).then((data) => {
                response.render("speakers/editSpeaker", {
                    userData: data
                });
            }).catch((err) => {
                response.send(" " + err);
            });
        })
        speakerRouter.post("/edit", (request, response) => {

            SpeakerModel.update({
                _id: request.body._id
            }, {
                $set: {
                    fullname: request.body.fullname,
                    "address.city": request.body.city,
                    "address.street": request.body.street,
                    "address.building": request.body.building
                }
            }).then((data) => {
                response.redirect("/speakers/list");
            }).catch((err) => {
                response.send(" " + err);
            });
        });
        speakerRouter.get("/delete/:_id", (request, response) => {
            SpeakerModel.deleteOne({
                _id: request.params._id
            }).then((data) => {
                response.send("Done");
            }).catch((err) => {
                response.send(" " + err);
            });
        });
        speakerRouter.post("/delete", (request, response) => {
            response.send("POST Speaker delete");

        });
        speakerRouter.get("/list", (request, response) => {
            SpeakerModel.find({}).then((data) => {
                response.render("speakers/listSpeakers", {
                    userData: data
                })
            }).catch((err) => {
                response.send(" " + err);
            });
        });
        next();
    } else {
        response.redirect("/login");
    }

});
module.exports = speakerRouter;