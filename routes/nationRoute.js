const express = require("express");
const bodyParser = require("body-parser");
const Nations = require("../models/nations");
const nationsController = require("../controllers/nationsController");

const nationRouter = express.Router();
nationRouter.use(bodyParser.json());

const checkAuth = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const user = req.cookies.user;
  if (!sessionId || !user || !user.isAdmin) {
    return res.redirect("/login");
  }
  next();
};

nationRouter
  .route("/")
  .get(nationsController.index)
  .post(checkAuth, nationsController.add);

nationRouter
  .route("/edit/:nationId")
  .post(checkAuth, nationsController.update)
  .get(checkAuth, nationsController.del);

module.exports = nationRouter;
