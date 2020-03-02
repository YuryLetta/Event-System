let express = require("express");
let path = require("path");
let mongoose = require("mongoose");

let authenticationRouter = require("./Routers/authRouter");
let speakerRouter = require("./Routers/speakerRouter");
let eventRouter = require("./Routers/eventRouter");
let adminRouter = require("./Routers/adminRouter");
const session = require('express-session');

const server = express();
server.listen(8080, () => {
    console.log("Server is listening at 8080 ....");
});

/* ******************** DB Connection ***************** */
mongoose.connect("mongodb://localhost:27017/EventSystem",{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("DB Connected");
}).catch((error)=>{
    console.log(error+" ");
});
// Middleware
server.use(function (request, response, next) {
    console.log("First MW " + request.url + " : " + request.method);
    next();
});
server.get("/home", function (request, response, next) {
    response.send("Home page");
});
/* ******************** Settings ***************** */
server.use(session({secret: 'fatma',saveUninitialized: true,resave: true}));
server.use(express.urlencoded({extended:true}));
server.set('view engine','ejs');
server.set("views",path.join(__dirname,"views"));
server.use(express.static(path.join(__dirname,"public")));
server.use(express.static(path.join(__dirname, 'node_modules')));
/** Session */

/* ******************** End of Settings ***************** */

server.use(authenticationRouter);
server.use((request, response, next) => {
    if (request.session.role)
    {
        response.locals.speakername = request.session.name;
        next();
    }
        
    else
        response.redirect("/login");
});
server.use("/speakers", speakerRouter);
server.use("/events", eventRouter);
server.use("/admin", adminRouter);
server.use(function (request, response, next) {
//    response.send("Page Not Found");
   response.render("include/notFound");

    next();
});