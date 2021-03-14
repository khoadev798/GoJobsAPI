const adminService = require("../service/admin.service");
const employerService = require("../service/employer.service");
const jwtHelper = require("../helpers/jwt.helper");
const { IpRecordContext } = require("twilio/lib/rest/voice/v1/ipRecord");

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

let employerManagementPage = async (req, res) => {
  let { search, sort, filter, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }
  let employerPagination = await employerService.employerPagination({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });
  let employerList = employerPagination.employers;
  let pageCount = employerPagination.pageCount;
  res.render("employer/tableEmployer", {
    layout: "layout",
    title: "Employer",
    admin: req.admin,
    employerList,
    pageCount,
    helpers: {
      forInRange: function (from, to, incr, block) {
        var accum = "";
        for (var i = from; i <= to; i += incr) accum += block.fn(i);
        return accum;
      },
    },
  });
};

module.exports = {
  loginPage,
  mainPage,
  adminLogin,
  employerManagementPage,
};
