const mongoose = require("mongoose");

const nationSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },
    capital: {
      type: "object",
      required: false,
    },

    flag: {
      type: "object",
      required: false,
    },
   
    region: {
      type: "string",
      required: false,
    },
  },
  {
    timestamps: true,
  },
  {strictPopulate: false}
);

const Nations = mongoose.model("Nations", nationSchema);

module.exports = Nations;
