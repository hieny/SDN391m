const Players = require("../models/players");
const Nations = require("../models/nations");
const mongoose = require("mongoose");

class playerController {
  async index(req, res) {
    const pageSize = 3;
    const currentpage = parseInt(req.query.page) || 1;
    const count = await Players.countDocuments();
    const totalPage = Math.ceil(count / pageSize);
    console.log(currentpage,totalPage)
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
    ])
      .skip((currentpage - 1) * pageSize)
      .limit(pageSize)
      .exec((err, results) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Error getting players", status: 500 });
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
            currentpage,
            totalPage,
            pageRange: getRangesPagin(currentpage, totalPage, 5),
          });
        });
      });

    function getRangesPagin(current, total, pageRangeSize) {
      const range = [];
      let start = current - Math.floor(pageRangeSize / 2);
      let end = current + Math.floor(pageRangeSize / 2);

      if (start < 1) {
        start = 1;
        end = pageRangeSize;
      }
      if (end > total) {
        end = total;
      }
      for(let i = start; i <= end; i++) {
        range.push(i);
       }
      console.log(range);
      return range;
    }
  }

 async playerDetail (req,res,next) {
  const sessionId = req.cookies.sessionId;
      const user = req.cookies.user;
      const id = req.params.playerId;
    await Players.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(id) } // Add $match stage to filter by ID
      },
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
    ]).exec((err,player) =>{
      if(err) {
        res.render("error",{err})
      }else{
          const detail = player[0]
          console.log(detail);
          res.render("playerDetail", {detail,sessionId,user})
        
      }

    })
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
