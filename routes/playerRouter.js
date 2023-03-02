const express = require("express");
const bodyParser = require("body-parser");
const playersController = require("../controllers/playersController");

const playerRouter = express.Router();

const checkAuth = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const user = req.cookies.user;
  if (!sessionId || !user || !user.isAdmin) {
    return res.redirect("/login");
  }
  next();
};

playerRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;

    next();
  })
  .get(playersController.index)
  .post(checkAuth, playersController.add);

playerRouter
  .route("/edit/:playerId")
  .post(checkAuth, playersController.update)
  .get(checkAuth, playersController.del);



module.exports = playerRouter;
