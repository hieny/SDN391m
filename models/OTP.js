const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    }
})

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;