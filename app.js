const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const sassMiddleware = require('node-sass-middleware');
const morgan = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

let chalk = require('chalk');
let auth = require('./services/auth');

// =======================
// configuration
// =======================
const port = process.env.PORT || 3000;
mongoose.set("debug", true);

// All environments
app.set("port", port);
app.set("views", path.join(__dirname, "/public/views/"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SASS
app.use(sassMiddleware({ 
    src: path.join(__dirname, '/public/sass'), 
    dest: path.join(__dirname, '/public/stylesheets'),
    prefix:  '/stylesheets', 
    //debug: true,
    outputStyle: 'compressed',
    //indentedSyntax : false,
    //sourceMap: true
}));
app.use(express.static(path.join(__dirname, "public")));

mongoose
    .connect(
        "mongodb://localhost:27017/local",
        { useNewUrlParser: true }
    )
    .then(
        () => {},
        err => {
            console.log(err);
        }
    ); 

// Logger
app.use(morgan("dev"));

// ------- Session & Notifications
app.use(flash());
app.use(
    session({ secret: "scooby doo2", resave: false, saveUninitialized: false })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
var User = require("./models/User");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL VARS & MESSAGES
app.use((req, res, next) => {
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;

    next();
});

// ROUTES
const tripRoutes = require("./routes/trips");
const userRoutes = require("./routes/users");

app.get("/", auth.isLoggedIn, (req, res) => {
    res.render("pages/index", { user: req.user });
});

// User
app.get("/api/users/register", userRoutes.register);
app.post("/api/users/register", userRoutes.doRegister);
app.get("/api/users/login", userRoutes.login);
app.post("/api/users/login", userRoutes.doLogin);
app.get("/api/users/logout", userRoutes.logout);

// Trips
app.get("/api/trips", auth.isLoggedIn, tripRoutes.getAllTrips);
app.post("/api/trips", auth.isLoggedIn, tripRoutes.saveTrip);
app.get("/api/trips/new", auth.isLoggedIn, tripRoutes.newTrip);
app.get("/api/trips/:id", auth.isLoggedIn, tripRoutes.getTrip);
app.get("/api/trips/:id/edit", auth.isLoggedIn, tripRoutes.getEditTrip);
app.get("/api/trips/:id/delete", auth.isLoggedIn, tripRoutes.deleteTrip);
app.get("/api/trips/:id/duplicate", auth.isLoggedIn, tripRoutes.duplicate);

// Listen
app.listen(port, () => {
    console.log(chalk.green(`   ---> Server running on port ${port}`))
});