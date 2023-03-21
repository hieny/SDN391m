const User = require("../models/user");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const { Vonage } = require("@vonage/server-sdk");
const nodemailer = require("nodemailer");

class userController {
  index(req, res, next) {
    // res.clearCookie("sessionId");
    // res.clearCookie("user");
    const success = req.query.success;
    console.log("hello");
    User.find().then(() => {
      res.render("signIn", { success });
    });
  }
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.render("signIn", {
          message: "Account is not exited! Please use other account.",
        });
      }
      console.log(password, user.password);

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.render("signIn", {
          message: "Invalid username or password! Please try again",
        });
      }

      // Passwords match, user is authenticated
      // Set a cookie or create a session and redirect the user to a secure page
      res.cookie("user", user);
      const sessionId = crypto.randomBytes(16).toString("hex");
      res.cookie("sessionId", sessionId);
      res.redirect("/");
    } catch (error) {
      // Handle error
      console.error(error);
      res.render("error", { message: "An error occurred" });
    }
  }
  async forgotPassword(req, res) {
    res.render("forgotpassword");
  }

  async checkUserName(req, res) {
    const { username } = req.query;
    const user = await User.findOne({ username });
    console.log("hello", user);
    if (user) {
      // return res.render("forgotpassword2", { username });
      // res.status(200).send({username: username});
      res.json({ status: "success", username: username });
      // res.json({ status: 'success', username: username });
    } else {
      // return res.render("forgotpassword", {
      //   errorMessage: "Username is not existed",
      // });
      res.json({ status: "fail" });
    }
  }

  async sendOTP(req, res) {
    const { username, email, phone } = req.body;
    console.log("herere");
    console.log("email:", email, "phone", phone, "username:", username);
    // if (phone) {
    //   const vonage = new Vonage({
    //     apiKey: "5bfeb38f",
    //     apiSecret: "NBhkX2I8YS0b3O2D",
    //   });
    //   const secret = speakeasy.generateSecret({ length: 6 });
    //   const otp = speakeasy.totp({
    //     secret: secret.base32,
    //     encoding: "base32",
    //   });
    //   const saltRounds = 10;
    //   const salt = await bcrypt.genSalt(saltRounds);
    //   // Hash a password
    //   const hash = await bcrypt.hash(otp, salt);
    //   const phoneNumber = `84${phone.slice(1, phone.length)}`;
    //   const from = "Vonage APIs";
    //   const to = phoneNumber;
    //   const text = `Vonage SMS API, your otp: ${otp}`;
    //   console.log("phoneNumber: " + phoneNumber, otp);
    //   // Check if the username already exists in the database
    //   const existingOTP = await OTP.findOne({ username });
    //   if (existingOTP) {
    //     await OTP.deleteOne({ username }); // Delete the existing username
    //   }
    //   const newOTP = new OTP({
    //     username,
    //     otp: hash,
    //   });

    //   console.log("newOTP: " + newOTP);

    //   await vonage.sms
    //     .send({ to, from, text })
    //     .then((resp) => {
    //       console.log("Message sent successfully");
    //       console.log(resp);
    //       newOTP.save();
    //       return res.render("forgotpassword3", { username, phone });
    //     })
    //     .catch((err) => {
    //       console.log("There was an error sending the messages.");
    //       console.error(err);
    //     });
    // }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        const existingOTP = await OTP.findOne({ username });
        if (existingOTP) {
          await OTP.deleteOne({ username }); // Delete the existing username
        }
        const secret = speakeasy.generateSecret({ length: 6 });
        const otp = speakeasy.totp({
          secret: secret.base32,
          encoding: "base32",
        });
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash a otp
        const hash = await bcrypt.hash(otp, salt);
        const newOTP = new OTP({
          username,
          otp: hash,
        });
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "tranhoangquanghien@gmail.com",
            pass: "J T BVYRK IGTAXLVHD",
          },
        });
        let mailOptions = {
          from: "tranhoangquanghien@gmail.com",
          to: email,
          subject: "FIFA OTP",
          text: `Your OTP is: ${otp}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.json({ status: "faild2"});
          } else {
            console.log("Email sent: " + info.response);
            newOTP.save();
            res.json({ status: "success", username: username });
          }
        });
      } else {
        res.json({ status: "faild1" });
      }
    } else {
      res.json({ status: "faild" });
    }
  }

  async verifyOTP(req, res) {
    const { username, otp } = req.body;

    const userOTP = await OTP.findOne({ username });
    if (userOTP) {
      const match = await bcrypt.compare(otp, userOTP.otp);
      console.log(match);
      if (match) {
        // return res.render("changePassword", { username });
        res.json({ status: "success", username: username });
      } else {
        res.json({ status: "faild"});
      }
    } else {
      //handle error not found username
    }
  }

  async changePassword(req, res) {
    const { username, password } = req.body;
    console.log("change");
    console.log(username, password);
    const user = await User.findOne({ username });
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (match) {
      // return res.render("changePassword", {
      //   error: "New password is the same to old password! Please try again",
      // });
      res.json({ status: "likeold" });
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      // Hash a password
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
      try {
        console.log("asdadea", match);
        user.save();
        res.json({ status: "success" });
        // res.redirect("/login");
      } catch (err) {}
    }
  }
}

module.exports = new userController();
