var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const session = require('express-session');
const passport = require('passport');


const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const nationRouter = require("./routes/nationRoute");
const playerRouter = require("./routes/playerRouter");
const continentRouter = require("./routes/continents");
const authenRouter = require("./routes/auth");
const regisRouter = require("./routes/regis");
const logoutRouter = require("./routes/logout");
const accountRouter = require("./routes/accountRouter");

var app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/football",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("Failed to connect to database:", err);
    } else {
      console.log("Successfully connected to database");
    }
  }
);

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.authenticate('session'));



const corsOpts = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOpts));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/nations", nationRouter);
app.use("/continents", continentRouter);
app.use("/players", playerRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", authenRouter);
app.use("/register",regisRouter);
app.use("/logout",logoutRouter);
app.use("/accounts",accountRouter );




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
  res.render("error",{err});
});

app.listen(3001, () => {
  console.log("To-Do application is listening on port 3001");
});

module.exports = app;
