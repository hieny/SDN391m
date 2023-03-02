const mongoose = require("mongoose");

const continentSchema = new mongoose.Schema(
  {
    continentName: {
      type: "string",
      required: true,
    },
    image: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Continents = mongoose.model("Continents", continentSchema);

module.exports = Continents;
