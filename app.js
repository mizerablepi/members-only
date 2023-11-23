const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const asyncHandler = require("express-async-handler");
const signupRouter = require("./sign-up/signup.route");
const loginRouter = require("./log-in/login.route");
const boardController = require("./board/board.controller");
const User = require("./models/user");

//CONNECT TO DB
mongoose.connect(process.env.URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//MIDDLEWARE
app.use(logger("dev"));
app.use(express.json());

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/sign-up", signupRouter);
app.use("/log-in", loginRouter);
app.get("/log-out", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/log-in");
  });
});

app
  .route("/membership")
  .get((req, res) => {
    res.render("membership_form");
  })
  .post(
    asyncHandler(async (req, res) => {
      if (req.body.secret === "secret") {
        let user = req.user;
        user.membership_status = "Member";
        user.save();
        res.redirect("/");
      } else {
        res.render("membership_status", { error: "Wrong key!" });
      }
    })
  );

app.get("/", boardController.index);
app.post("/", boardController.messagePost);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
