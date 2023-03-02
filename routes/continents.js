const express = require("express");
const bodyParser = require("body-parser");
const Continents = require("../models/continent");

const continentRouter = express.Router();

continentRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    //  res.setHeader("Content-Type", "application/json");

    next();
  })
  .get(async (req, res, next) => {
    const continent = await Continents.find();

    // res.status(200).json({
    //   status: 200,
    //   data: continent,
    // });

    // const nationList = await Nations.find();
    res.render("index", { contientList: continent });
  })
  .post(async (req, res, next) => {
    // res.send(`Will add nation:${req.body.name}  with detail:`);
    if (req.body.continentName === undefined || req.body.image === undefined) {
      res.statusCode = 400;
      //   res.json({
      //     status: 400,
      //     message: "Did not receive body content",
      //   });
    } else {
      res.statusCode = 201;
      const continent = new Continents({
        continentName: req.body.continentName,
        image: req.body.image,
      });
      try {
        const newContinent = await continent.save();
        res.status(201).json({ message: "success", status: 201 });
      } catch {
        res.status(400).json({ message: error.message, status: 400 });
      }
      //   res.json({
      //     status: 201,
      //     message: `Will add nation:${req.body.name}  with detail: ${req.body.description}`,
      //   });
    }
    next();
  })

  .put((req, res, next) => {
    // res.statusCode = 404;
    // res.json({
    //   status: 404,
    //   message: `PUT operation is not supported on /nations`,
    // });
  })
  .delete((req, res, next) => {
    // console.log(req.params);
    // res.json({
    //   status: 404,
    //   message: `DELETE opration is not supported on /nations`,
    // });
  });

continentRouter
  .route("/:nationId")
  .all((req, res, next) => {
    // res.statusCode = 200;
    // res.setHeader("Content-Type", "application/json");
    // next();
  })
  .get((req, res) => {
    // res.json({
    //   status: 200,
    //   message: `Get nation with id ${req.params.nationId} from nations`,
    // });
  })
  .post((req, res, next) => {
    // res.statusCode = 404;
    // res.json({
    //   status: 404,
    //   message: `POST operation is not supported on /nations/${req.params.nationId}`,
    // });
  })
  .put((req, res, next) => {
    // res.statusCode = 201;
    // res.json({
    //   status: 201,
    //   message: `Update nation with ID: ${req.params.nationId} successfully`,
    // });
  })
  .delete((req, res, next) => {
    // res.statusCode = 200;
    // res.json({
    //   status: 200,
    //   message: `Delete nation with ID: ${req.params.nationId} successfully`,
    // });
  });
module.exports = continentRouter;
