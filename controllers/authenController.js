const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
        return res.render('signIn', { message: 'Account is not exited! Please use other account.' });
      }
      console.log(password, user.password);
  
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.render('signIn', { message: 'Invalid username or password! Please try again' });
      }
      
      // Passwords match, user is authenticated
      // Set a cookie or create a session and redirect the user to a secure page
      res.cookie('user', user);
      const sessionId = crypto.randomBytes(16).toString("hex");
      res.cookie("sessionId", sessionId);
      res.redirect('/');
    } catch (error) {
      // Handle error
      console.error(error);
      res.render('error', { message: 'An error occurred' });
    }
  }
  

}

module.exports = new userController();
