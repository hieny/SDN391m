var express = require("express");
const accountController = require("../controllers/accountController");
var accountRouter = express.Router();
var User = require("../models/user");

const checkAuth = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const user = req.cookies.user;
  if (!sessionId || !user || !user.isAdmin) {
    return res.redirect("/login");
  }
  next();
};

accountRouter.route("/").get(checkAuth,accountController.index);

accountRouter.route("/edit").post(accountController.update);

module.exports = accountRouter;
