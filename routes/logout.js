var express = require("express");
var logoutRouter = express.Router();

logoutRouter.get("/", function (req, res, next) {
  // Clear session ID cookie
  res.clearCookie("sessionId");
  res.clearCookie("user");

  // Redirect user to login page
  res.redirect("/");
});

module.exports = logoutRouter;
