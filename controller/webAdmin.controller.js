const adminService = require("../service/admin.service");
const jwtHelper = require("../helpers/jwt.helper");

let loginPage = (req, res, next) => {
  res.render("login", { layout: false, title: "Login" });
};

let mainPage = (req, res, next) => {
  res.render("main", { layout: "layout", title: "Main", admin: req.admin });
};

let adminLogin = async (req, res) => {
  let { email, password } = req.body;
  //   console.log(email, password);
  let adminLoginResult = await adminService.login({
    email,
    password,
  });
  console.log(adminLoginResult);
  if (adminLoginResult.code == 200) {
    await jwtHelper.generateAdminWebToken(
      res,
      adminLoginResult.admin._id,
      adminLoginResult.admin.name
    );
    res.render("main", {
      layout: "layout",
      title: "Admin",
      admin: adminLoginResult.admin,
    });
  } else {
    res.render("login", { layout: false, title: "Login" });
  }
};

let employerManagementPage = (req, res) => {
  res.render("employer/tableEmployer", {
    layout: "layout",
    title: "Employer",
    admin: req.admin,
  });
};

module.exports = {
  loginPage,
  mainPage,
  adminLogin,
  employerManagementPage,
};
