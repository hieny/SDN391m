const Players = require("../models/players");
const Nations = require("../models/nations");

class playerController {
  async index(req, res) {
    await Players.aggregate([
      {
        $lookup: {
          from: "nations",
          localField: "nation",
          foreignField: "_id",
          as: "nation_data",
        },
      },
      {
        $unwind: "$nation_data",
      },
    ]).exec((err, results) => {
      if (err) {
        res.status(500).json({ message: "Error getting players", status: 500 });
      }
      const sessionId = req.cookies.sessionId;
      const user = req.cookies.user;
      const success = req.query.success;
      const se = req.query.se;
      Nations.find().then((nations) => {
        res.render("player", {
          results,
          nations,
          sessionId,
          user,
          success,
          se,
        });
      });
    });
  }

  async add(req, res) {
    const { name, image, dob, club, position, goals, isCaptain, nation } =
      req.body;

    let captain = false;
    if (isCaptain === "on") {
      captain = true;
    }
    const player = new Players({
      name,
      image,
      dob,
      club,
      position,
      goals,
      isCaptain: captain,
      nation,
    });
    try {
      await player.save();

      res.redirect("/players");
    } catch (error) {
      res.render("error", { err: error });
    }
  }

  async update(req, res) {
    console.log("update");
    const player = await Players.findById(req.params.playerId);
    const { name, image, dob, position, goals, isCaptain, club, nation } =
      req.body;

    let captain = false;
    if (isCaptain === "on") {
      captain = true;
    }

    player.name = name;
    player.image = image;
    player.dob = dob;
    player.position = position;
    player.goals = goals;
    player.isCaptain = captain;
    player.club = club;
    player.nation = nation;
    try {
      player.save();
      res.redirect("/players?se=true");
    } catch (error) {
      res.redirect("/players?se=false");
    }
  }

  async del(req, res) {
    const id = req.params.playerId;
    Players.deleteOne({ _id: id }, (err) => {
      if (err) {
        res.redirect("/players?success=false");
      } else {
        res.redirect("/players?success=true");
      }
    });
  }
}

module.exports = new playerController();
