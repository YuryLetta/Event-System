const express = require("express");
const authenticationRouter = express.Router();
let mongoose = require("mongoose");
require("../Models/speakerModel");
let SpeakerModel = mongoose.model("speakers");
let path = require("path");

authenticationRouter.get("/login", (request, response) => {
    // response.send("Login GET");
    // response.sendFile(path.join(__dirname,"..","views","authentication","login.html"));
    response.render("authentication/login");
});
authenticationRouter.post("/login", (request, response) => {
    if (request.body.username == "fatma" && request.body.password == "123") {    
        response.redirect("/admin/profile/fatma");
    } else {
        SpeakerModel.find({
            username: request.body.username,
            password: request.body.password
        }).then((data) => {
            if (data.length == 0) {
                response.redirect("/login");
            } else {
                response.redirect("/speakers/profile");
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
    newSpeaker.save().then((data)=>{
        response.redirect("/login");
    }).catch((err)=>{
       response.send(" "+err);
    });
});
authenticationRouter.get("/logout", (request, response) => {
    response.send("Logout GET");
});
module.exports = authenticationRouter;