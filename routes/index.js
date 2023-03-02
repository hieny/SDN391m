var express = require('express');
var router = express.Router();
var Player = require('../models/players');


/* GET home page. */
router.get('/', async function(req, res, next) {
  const sessionId = req.cookies.sessionId
  const user = req.cookies.user;

    await Player.aggregate([
      {
        $match: { isCaptain: true }
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
    ]).exec((err, captain) => {
      if (err) {
        res.status(500).json({ message: "Error getting players", status: 500 });
      }
      
      res.render('index', { sessionId,user,captain });
    });
  }
);

router.get('/info', function(req, res, next) {
  const sessionId = req.cookies.sessionId
  const user = req.cookies.user
  res.render('info', { sessionId,user });
});

module.exports = router;
