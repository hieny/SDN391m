const Nations = require("../models/nations");
const mongoose = require("mongoose");

class nationsController {
  async index(req, res) {
    Nations.find()
      .then((nations) => {
        const sessionId = req.cookies.sessionId;
        const user = req.cookies.user;
        const success = req.query.success;
        const se = req.query.se;

        res.render("nation", { nations, user, sessionId, success, se });
      })
      .catch(() => {
        res.json({ message: "error" });
      });
  }
  async add(req, res) {
    const { name, capital, flag, region } = req.body;
    const nations = new Nations({
      name,
      capital: [capital],
      flag: { png: flag },
      region,
    });

    try {
      nations.save();
      // res.status(201).json({ message: "add success", status: 201 });
      res.redirect("/nations");
    } catch (error) {
      // res.status(400).json({ message: error.message, status: 201 });
      res.render("error", { err: error });
    }
  }
  async update(req, res) {
    const nation = await Nations.findById(req.params.nationId);
    const { name, capital, flag, region } = req.body;
    nation.capital = capital;
    nation.flag = { png: flag };
    nation.name = name;
    nation.region = region;
    try {
      nation.save();
      // res.status(200).json({ message: "Update successfully" });
      res.redirect("/nations?se=true");
    } catch (error) {
      // res.status(400).json({ message: error.message, status: 400 });
      res.render("error", { err: error });
    }
  }
  async del(req, res) {
    const id = req.params.nationId;

    // Use $lookup to check if the Nation has any associated Players
    const nation = await Nations.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "players",
          localField: "_id",
          foreignField: "nation",
          as: "players",
        },
      },
    ]).exec();

    if (nation.length > 0 && nation[0].players.length > 0) {
      // Nation has associated Players, do not delete
      res.redirect("/nations?success=false");
    } else {
      Nations.deleteOne({ _id: id }, (error) => {
        if (error) {
          // res.status(500).json({ message: "Delete Failed", status: 500 });
          res.render("error", { err: error });
        } else {
          // res.status(200).json({ message: "Delete Successful", status: 200 });
          res.redirect("/nations?success=true");
        }
      });
    }
  }
}

module.exports = new nationsController();
