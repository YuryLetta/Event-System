const express = require("express");
const adminRouter = express.Router();
adminRouter.get("/profile/:name", (request, response) => {
    console.log(request.params.name);
    response.render("admin/profile",{"username":request.params.name});

});
module.exports = adminRouter;