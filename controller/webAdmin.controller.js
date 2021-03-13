const adminService = require("../service/admin.service");

let loginPage = (req, res, next) => {
  res.render("login", { layout: false, title: "Login" });
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
  res.render("employer/tableEmployer", { layout: false, title: "Employer" });
};

module.exports = {
  loginPage,
  adminLogin,
  employerManagementPage,
};
