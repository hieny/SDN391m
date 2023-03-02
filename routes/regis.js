var express = require("express");
const regisController = require("../controllers/regisController");
var regisRouter = express.Router();

regisRouter
  .route("/")
  .get(regisController.index)
  .post(regisController.register);

module.exports = regisRouter;
