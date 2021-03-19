const adminService = require("../service/admin.service");
const employerService = require("../service/employer.service");
const freelancerService = require("../service/freelancer.service");
let walletService = require("../service//wallet.service");
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

let freelancerManagementPage = async (req, res) => {
  let { search, sort, filter, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }
  let employerPagination = await freelancerService.flcPaginationForAdminWeb({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });
  let freelancerList = employerPagination.freelancers;
  let pageCount = employerPagination.pageCount;
  res.render("freelancer/tableFreelancer", {
    layout: "layout",
    title: "Freelancer",
    admin: req.admin,
    freelancerList,
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

let updateEmpWalletPage = (req, res) => {
  let { empId, empName, walletId } = req.query;
  // console.log(empId, empName, walletId);
  res.render("employer/updateEmpWallet", {
    layout: "layout",
    title: "Update EmpWallet",
    admin: req.admin,
    info: { empId, empName, walletId },
  });
};

let updateFlcWalletPage = (req, res) => {
  let { flcId, flcName, walletId } = req.query;
  console.log(flcId, flcName, walletId);
  res.render("freelancer/updateFlcWallet", {
    layout: "layout",
    title: "Update FlcWallet",
    admin: req.admin,
    info: { flcId, flcName, walletId },
  });
};

let updateEmpWalletById = async (req, res) => {
  let { empId, empName, balance, walletId, adminId } = req.body;
  // console.log(empId, balance, walletId, adminId);
  let updateWalletResult = await walletService.updateWalletBalanceByIdOnWebAdmin(
    {
      empId,
      balance,
      walletId,
      adminId,
      isCreatedByAdmin: true,
    }
  );
  if (updateWalletResult.code == 200) {
    res.redirect(`/web/employer?search=${empName}`);
  }
};

let updateFlcWalletById = async (req, res) => {
  let { flcId, flcName, balance, walletId, adminId } = req.body;
  // console.log(flcId, balance, walletId, adminId);
  let updateWalletResult = await walletService.updateWalletBalanceByIdOnWebAdmin(
    {
      flcId,
      balance,
      walletId,
      adminId,
      isCreatedByAdmin: true,
    }
  );
  console.log(updateWalletResult);
  // if (updateWalletResult.code == 200) {
  res.redirect(`/web/freelancer?search=${flcName}`);
  // }
};

module.exports = {
  loginPage,
  mainPage,
  adminLogin,
  employerManagementPage,
  updateEmpWalletPage,
  updateEmpWalletById,
  freelancerManagementPage,
  updateFlcWalletPage,
  updateFlcWalletById,
};
