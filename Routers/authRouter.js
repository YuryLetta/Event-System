const express = require("express");
const authenticationRouter = express.Router();
let mongoose = require("mongoose");
require("../Models/speakerModel");
let SpeakerModel = mongoose.model("speakers");
let path = require("path");

authenticationRouter.get("/login", (request, response) => {
    if (!request.session.role) {
        response.render("authentication/login");
    } else if (request.session.role == "speaker") {
        response.redirect("/speakers/profile");
    }
    else if (request.session.role == "admin") {
        response.redirect("/admin/profile");
    }
});
authenticationRouter.post("/login", (request, response) => {
    if (request.body.username == "fatma" && request.body.password == "123") {
        request.session.role = "admin";
        request.session.name = "fatma";
        response.redirect("/admin/profile");
    } else {
        SpeakerModel.findOne({
            username: request.body.username,
            password: request.body.password
        }).then((data) => {
            if (!data) {
                response.redirect("/login");
            } else {
                request.session._id = data._id;
                request.session.name = data.fullname;
                response.locals.speakername = request.session.name;
                console.log("speaker name :", response.locals.speakername);
                request.session.role = "speaker";
                response.redirect("/speakers/profile");
                next();

            }
        }).catch((err) => {
            response.send(" " + err);
        });

    }
});
authenticationRouter.get("/register", (request, response) => {
    response.render("authentication/register");
});
authenticationRouter.post("/register", (request, response) => {
    let newSpeaker = new SpeakerModel(request.body);
    newSpeaker.save().then((data) => {
        response.redirect("/login");
    }).catch((err) => {
        response.send(" " + err);
    });
});
authenticationRouter.get("/logout", (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        response.redirect("/login");
    })
});
module.exports = authenticationRouter;