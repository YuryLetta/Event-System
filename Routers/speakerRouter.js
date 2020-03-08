const express = require("express");
const speakerRouter = express.Router();
let mongoose = require("mongoose");
require("../Models/speakerModel");
let SpeakerModel = mongoose.model("speakers");
require("../Models/eventModel");
let eventModel = mongoose.model("events");

/************************************************** */
speakerRouter.use((request, response, next) => {
    if (request.session.role == "admin") {
        next();
    } else {
        response.redirect("/login");
    }
});
speakerRouter.get("/add", (request, response) => {
    response.render("speakers/addSpeaker");
})
speakerRouter.post("/add", (request, response) => {
    let newSpeaker = new SpeakerModel(request.body);
    newSpeaker.save().then((data) => {
        return response.redirect("/speakers/list");
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
        return response.redirect("/speakers/list");
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
    if (request.session.role == "admin") {
        console.log("session role list", request.session.role);

        SpeakerModel.find({}).then((data) => {
            response.render("speakers/listSpeakers", {
                userData: data
            })
        }).catch((err) => {
            response.send(" " + err);
        });
    } else {
        return response.redirect("/speakers/profile")
    }
});

module.exports = speakerRouter;