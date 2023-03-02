const User = require("../models/user");
class accountController {
  async index(req, res, next) {
    const sessionId = req.cookies.sessionId;
    const user = req.cookies.user;
    await User.find()
      .then((userList) => {
        res.render("accounts", { sessionId, user, userList });
      })
      .catch((err) => {
        res.render("error", { err });
      });
  }
  async update(req, res, next) {
    const { name, dob, id } = req.body;
    console.log("hêr");
    try {
      const user = await User.findById(id);
      user.name = name;
      user.dob = dob;
      user.save();
      // Clear session ID cookie
      res.clearCookie("sessionId");
      res.clearCookie("user");

      // Redirect user to login page

      res.redirect("/login");
    } catch (err) {
      console.log("notok");
      console.log(err);
      next(err);
    }
  }
}

module.exports = new accountController();
