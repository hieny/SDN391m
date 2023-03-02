const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },
    image: {
      type: "string",
      required: true,
    },
    dob: {
      type: "Date",
      required: false,
    },
    club: {
      type: "string",
      required: false,
    },
    position: {
      type: "string",
      required: false,
    },
    goals: {
      type: "number",
      required: false,
    },
    isCaptain: {
      type: "boolean",
      required: false,
    },
    nation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nations",
    },
  },
  {
    timestamps: true,
  }
);

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
