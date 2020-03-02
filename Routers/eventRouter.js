const express = require("express");
const eventRouter = express.Router();
let mongoose = require("mongoose");
require("../Models/eventModel");
let eventModel = mongoose.model("events");
let speakerModel = mongoose.model("speakers");
let moment = require("moment");

/***************************************** */
eventRouter.use((request, response, next) => {
    if (request.session.role == "admin") {
        eventRouter.get("/add", (request, response) => {
            speakerModel.find({}).then((data) => {
                response.render("events/addEvent", {
                    speakers: data
                });
            }).catch((err) => {
                console.log(err);
            });
        })
        eventRouter.post("/add", (request, response) => {
            let newEvent = new eventModel(request.body);
            newEvent.save().then((data) => {
                return response.redirect("/events/list");
            }).catch((err) => {
                response.send(" " + err);
            });
            //    response.send("POST event Add");
        })
        eventRouter.get("/edit/:_id", (request, response) => {
            eventModel.find({
                _id: request.params._id
            }).populate({
                path: "mainSpeaker otherSpeakers"
            }).then((events) => {
                speakerModel.find({}).then((speakers) => {
                    response.render("events/editEvent", {
                        eventData: events[0],
                        moment: moment,
                        speakers: speakers
                    });
                }).catch((err) => {
                    response.send(" " + err);
                });
            }).catch((err) => {
                response.send(" " + err);
            });
        })
        eventRouter.post("/edit", (request, response) => {
            eventModel.updateOne({
                _id: request.body._id
            }, {
                $set: {
                    title: request.body.title,
                    eventdate: request.body.eventdate,
                    mainSpeaker: request.body.mainSpeaker,
                    otherSpeakers: request.body.otherSpeakers
                }
            }).then((data) => {
                return response.redirect("/events/list")
            }).catch((err) => {
                response.send(" " + err);
            });
        })
        eventRouter.post("/delete", (request, response) => {
            response.send("GET event delete");
        })
        eventRouter.get("/delete/:_id", (request, response) => {
            eventModel.deleteOne({
                _id: request.params._id
            }).then((data) => {
                response.send("Done");
            }).catch((err) => {
                response.send(" " + err);
            });
        })
        eventRouter.get("/list", (request, response) => {
            eventModel.find({}).populate({
                path: "mainSpeaker otherSpeakers"
            }).then((data) => {
                response.render("events/listEvents", {
                    eventData: data
                })
            }).catch((err) => {
                response.send(" " + err);
            });
        })
        next();

    } else {
        return response.redirect("/login");
    }

});
module.exports = eventRouter;