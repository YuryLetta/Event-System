const express = require("express");
const adminRouter = express.Router();
adminRouter.get("/profile/", (request, response) => {
    response.render("admin/profile");

});
module.exports = adminRouter;