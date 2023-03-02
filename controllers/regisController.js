const User = require("../models/user");
const bcrypt = require("bcrypt");

class regisController {
  index(req, res, next) {
    
    const error = req.query.error;
    res.render("register", { title: "Register",error });
  }
  async register(req, res, next) {
    const { name, username, password, dob } = req.body;
    console.log(username);
    const existingUser = await User.findOne({
        username: username,
      });
    console.log(existingUser)
    if (existingUser !== null) {
        res.redirect("/register?error=true");
    } else {
      // Create new user if not already in database
      // Generate salt to use for hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      // Hash a password
      const hash = await bcrypt.hash(password, salt);
      const user = new User({
        name,
        username,
        password: hash,
        dob,
        isAdmin: false,
      });
      try {
        user.save();
        res.redirect("/login?success=true");
      } catch (error) {}
    }
  }
}

module.exports = new regisController();
