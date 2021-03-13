const userService = require("../service/user.service");

let loginPage = (req, res, next) => {
  res.render("login", { layout: false, title: "Login" });
};

let userLogin = async (req, res) => {
  let { email, password } = req.body;
  //   console.log(email, password);
  let userLoginResult = await userService.login({
    email,
    password,
  });
  if (userLoginResult.code == 200) {
    res.render("main", { layout: false, title: "Main" });
  } else {
    res.render("login", { layout: false, title: "Login" });
  }
};

module.exports = {
  loginPage,
  userLogin,
};
