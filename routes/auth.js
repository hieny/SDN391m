const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const User = require("../models/user");
const userController = require("../controllers/authenController");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const authenRouter = express.Router();

function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}

authenRouter.route("/").get(userController.index).post(userController.login);
authenRouter.route("/forgotpassword").get(userController.forgotPassword)
authenRouter.route("/forgotpassword/1").get(userController.checkUserName)
authenRouter.route("/forgotpassword/2").post(userController.sendOTP)
authenRouter.route("/forgotpassword/3").post(userController.verifyOTP)
authenRouter.route("/forgotpassword/change").post(userController.changePassword)

authenRouter.get("/federated/google", passport.authenticate("google"));

authenRouter.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    //set cookie for user
    const sessionId = generateSessionId();
    res.cookie("sessionId", sessionId);
     // Retrieve user data and store in local storage
     const user = req.user;
     const userData = {
       _id: user._id,
       username: user.username,
       name: user.name,
       dob: user.dob,
       isAdmin: user.isAdmin,
     };
     
    res.cookie("user", userData);
    //  localStorage.setItem("user", JSON.stringify(userData));
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "917994071317-6bj8d3efp3i0a5dc1uge00bklnut0072.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/login/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    async (issuer, profile, cb, done) => {
      const existingUser = await User.findOne({
        username: profile.emails[0].value,
      });

      if (existingUser) {
        return done(null, existingUser);
      }
      // Create new user if not already in database
      // Generate salt to use for hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      // Hash a password
      const password = profile.id;
      const hash = await bcrypt.hash(password, salt);
      const newUser = new User({
        username: profile.emails[0].value,
        password: hash,
        name: profile.displayName,
        isAdmin: false,
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);

// Set up serialization and deserialization
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

module.exports = authenRouter;
