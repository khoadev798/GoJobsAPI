const adminService = require("../service/admin.service");
const employerService = require("../service/employer.service");
const freelancerService = require("../service/freelancer.service");
const walletService = require("../service//wallet.service");
const jobService = require("../service/job.service");
const contractService = require("../service/contract.service");
const receiptService = require("../service/receipt.service");
const jwtHelper = require("../helpers/jwt.helper");
const emailService = require("../service/sendMail.service");
let alert = require("alert");

let loginPage = (req, res, next) => {
  res.clearCookie("token");
  res.render("login", { layout: false, title: "Login" });
};
let updatePasswordPage = (req, res, next) => {
  res.status(200).render("updatePassword", {
    layout: "layout",
    title: "Update password",
    admin: req.admin,
  });
};

let updateAdminPassword = async (req, res) => {
  let { password, password1 } = req.body;
  let admin = req.admin;
  console.log("Current:", password, " New:", password1);
  let updateResult = await adminService.adminUpdatePasswordOnWeb({
    _id: admin._id,
    password: password,
    newPassword: password1,
  });
  if (updateResult.code == 200) {
    res.clearCookie("token");
    res.redirect("/web");
  } else {
    res.clearCookie("token");
    res.render("error", {
      layout: false,
      code: updateResult.code,
      message: updateResult.message,
    });
  }
};

let mainPage = (req, res, next) => {
  res
    .status(200)
    .render("main", { layout: "layout", title: "Main", admin: req.admin });
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
    res.status(200).render("main", {
      layout: "layout",
      title: "Admin",
      admin: adminLoginResult.admin,
    });
  } else {
    res.status(401).render("error", {
      layout: false,
      code: 401,
      message: "Đăng nhập thất bại!",
    });
  }
};

let existingEmpSort;
let existingEmpSearch;
let employerManagementPage = async (req, res) => {
  let { search, sort, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }
  if (search == undefined && sort == undefined) {
    existingEmpSearch = undefined;
    existingEmpSort = undefined;
  } else {
    if (search) {
      existingEmpSearch = search;
    }
    if (sort) {
      existingEmpSort = sort;
    }
  }

  let employerPagination = await employerService.employerPagination({
    pageNumber,
    pageSize,
    search,
    sort,
  });
  let employerList = employerPagination.employers;
  let pageCount = employerPagination.pageCount;

  res.status(200).render("employer/tableEmployer", {
    layout: "layout",
    title: "Employer",
    admin: req.admin,
    search: existingEmpSearch,
    sort: existingEmpSort,
    employerList,
    pageCount,
  });
};

let existingFlcSort;
let existingFlcSearch;
let freelancerManagementPage = async (req, res) => {
  let { search, sort, pageNumber, pageSize } = req.query;

  if (!pageNumber) {
    pageNumber = 1;
  }

  if (!pageSize) {
    pageSize = 5;
  }

  if (search == undefined && sort == undefined) {
    existingFlcSort = undefined;
    existingFlcSearch = undefined;
  } else {
    if (search) {
      existingFlcSearch = search;
    }
    if (sort) {
      existingFlcSort = sort;
    }
  }
  let freelancerPagination = await freelancerService.flcPaginationForAdminWeb({
    search,
    sort,

    pageNumber,
    pageSize,
  });
  let freelancerList = freelancerPagination.freelancers;
  let pageCount = freelancerPagination.pageCount;
  res.render("freelancer/tableFreelancer", {
    layout: "layout",
    title: "Freelancer",
    admin: req.admin,
    search: existingFlcSearch,
    sort: existingEmpSort,
    freelancerList,
    pageCount,
  });
};
let existingJobSort;
let existingJobSearch;
let jobManagementPage = async (req, res) => {
  let { search, sort, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }
  if (search == undefined && sort == undefined) {
    existingJobSort = undefined;
    existingJobSearch = undefined;
  } else {
    if (search) {
      existingJobSearch = search;
    }
    if (sort) {
      existingJobSort = sort;
    }
  }
  let jobPaginationForWebAdmin = await jobService.jobPaginationForWebAdmin({
    search,
    sort,
    pageNumber,
    pageSize,
  });
  let jobList = jobPaginationForWebAdmin.jobs;
  let pageCount = jobPaginationForWebAdmin.pageCount;
  // res.send(jobPaginationForWebAdmin);
  res.render("job/tableJob", {
    layout: "layout",
    title: "Job",
    admin: req.admin,
    search: existingJobSearch,
    sort: existingJobSort,
    jobList,
    pageCount,
  });
};

let contractManagementPage = async (req, res) => {
  let { jobId, search, sort, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }

  let contractPaginationForWebAdmin = await contractService.contractPaginationForWebAdmin(
    {
      jobId,
      search,
      sort,
      pageNumber,
      pageSize,
    }
  );

  let contractList = contractPaginationForWebAdmin.contracts;
  let pageCount = contractPaginationForWebAdmin.pageCount;

  if (contractList.length > 0) {
    let statusArray = {
      array: [
        ["Status", "Contract status"],
        ["APPROVED", 0],
        ["ACCEPTED", 0],
        ["REJECTED", 0],
        ["COMPLETED", 0],
        ["CANCELLED", 0],
        ["APPLIED", 0],
      ],
    };
    // console.log(contractList);
    contractList.forEach((contract) => {
      if (contract.contractStatus == "APPROVED") {
        statusArray.array[1][1] = statusArray.array[1][1] + 1;
      }
      if (contract.contractStatus == "ACCPETED") {
        statusArray.array[2][1] = statusArray.array[2][1] + 1;
      }
      if (contract.contractStatus == "REJECTED") {
        statusArray.array[3][1] = statusArray.array[3][1] + 1;
      }
      if (contract.contractStatus == "COMPLETED") {
        statusArray.array[4][1] = statusArray.array[4][1] + 1;
      }
      if (contract.contractStatus == "CANCELLED") {
        statusArray.array[5][1] = statusArray.array[5][1] + 1;
      }
      if (contract.contractStatus == "APPLIED") {
        statusArray.array[6][1] = statusArray.array[6][1] + 1;
      }
    });

    res.render("contract/tableContract", {
      layout: "layout",
      title: "Contract",
      admin: req.admin,
      jobId,
      contractList,
      pageCount,
      encodedJson: encodeURIComponent(JSON.stringify(statusArray)),
      // array: statusArray.array,
    });
  } else {
    alert("This job has no contract");
    res.redirect("/web/job");
  }
};

let receiptManagementPage = async (req, res) => {
  let { search, from, to, sort, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }

  if (!from) {
    from = new Date("2000-01-01");
  }
  if (!to) {
    to = new Date("2100-01-01");
  }

  let receiptPaginationForWebAdmin = await receiptService.receiptPaginationForWebAdmin(
    {
      search,
      from,
      to,
      sort,
      pageNumber,
      pageSize: 5,
    }
  );
  let receiptList = receiptPaginationForWebAdmin.receipts;
  let pageCount = receiptPaginationForWebAdmin.pageCount;
  // res.send(receiptPaginationForWebAdmin);
  res.render("receipt/tableReceipt", {
    layout: "layout",
    title: "Receipt",
    admin: req.admin,
    receiptList,
    pageCount,
  });
};

let receiptInfoPage = async (req, res) => {
  let { _id } = req.query;

  let receiptInfo = await receiptService.receiptInfoForWebAdmin({
    _id,
  });
  let receipt = receiptInfo.receipt;
  // res.send(receipt);
  // let pageCount = receiptPaginationForWebAdmin.pageCount;
  // res.send(receiptPaginationForWebAdmin);
  res.render("receipt/receiptInfo", {
    layout: "layout",
    title: "Receipt",
    admin: req.admin,
    receipt,
  });
};

let statisticPage = async (req, res) => {
  let { year } = req.query;
  if (!year) {
    year = new Date().getFullYear();
  } else {
    year = parseInt(year, 10);
  }
  let queryResult = await receiptService.systemMonthlyIncome({ year });
  let receipts = queryResult.systemReceipts;
  let chartInfoList = {
    info: [],
  };

  let sum = 0;
  receipts.forEach((receipt) => {
    sum = sum + receipt.income;
    if (receipt._id == 1) {
      chartInfoList.info.push({
        name: "Jan",
        steps: receipt.income,
      });
    }
    if (receipt._id == 2) {
      chartInfoList.info.push({
        name: "Feb",
        steps: receipt.income,
      });
    }
    if (receipt._id == 3) {
      chartInfoList.info.push({
        name: "March",
        steps: receipt.income,
      });
    }
    if (receipt._id == 4) {
      chartInfoList.info.push({
        name: "April",
        steps: receipt.income,
      });
    }
    if (receipt._id == 5) {
      chartInfoList.info.push({
        name: "May",
        steps: receipt.income,
      });
    }
    if (receipt._id == 6) {
      chartInfoList.info.push({
        name: "June",
        steps: receipt.income,
      });
    }
    if (receipt._id == 7) {
      chartInfoList.info.push({
        name: "July",
        steps: receipt.income,
      });
    }
    if (receipt._id == 8) {
      chartInfoList.info.push({
        name: "August",
        steps: receipt.income,
      });
    }
    if (receipt._id == 9) {
      chartInfoList.info.push({
        name: "Sep",
        steps: receipt.income,
      });
    }
    if (receipt._id == 10) {
      chartInfoList.info.push({
        name: "Oct",
        steps: receipt.income,
      });
    }
    if (receipt._id == 11) {
      chartInfoList.info.push({
        name: "Nov",
        steps: receipt.income,
      });
    }
    if (receipt._id == 12) {
      chartInfoList.info.push({
        name: "Dec",
        steps: receipt.income,
      });
    }
  });

  res.render("statistic/statistic", {
    layout: "layout",
    title: "Statistic",
    admin: req.admin,
    sum,
    encodedJson: encodeURIComponent(JSON.stringify(chartInfoList)),
  });
};

let updateEmpWalletPage = (req, res) => {
  let { empId, empEmail, walletId } = req.query;
  // console.log(empId, empEmail, walletId);
  res.render("employer/updateEmpWallet", {
    layout: "layout",
    title: "Update EmpWallet",
    admin: req.admin,
    info: { empId, empEmail, walletId },
  });
};

let updateFlcWalletPage = (req, res) => {
  let { flcId, flcEmail, walletId } = req.query;
  console.log(flcId, flcEmail, walletId);
  res.render("freelancer/updateFlcWallet", {
    layout: "layout",
    title: "Update FlcWallet",
    admin: req.admin,
    info: { flcId, flcEmail, walletId },
  });
};

let updateEmpWalletById = async (req, res) => {
  let { empId, empEmail, balance, walletId, adminId } = req.body;
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
    res.redirect(`/web/employer?search=${empEmail}`);
  } else {
    res.render("error", {
      layout: false,
      code: 400,
      message: "Lỗi!",
    });
  }
};

let updateFlcWalletById = async (req, res) => {
  let { flcId, flcEmail, balance, walletId, adminId } = req.body;
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
  // console.log(updateWalletResult);
  if (updateWalletResult.code == 200) {
    res.redirect(`/web/freelancer?search=${flcEmail}`);
  } else {
    res.render("error", {
      layout: false,
      code: 400,
      message: "Lỗi!",
    });
  }
};

let adminResetPassword = async (req, res) => {
  let { email } = req.body;
  let sendEmailResult = await emailService.sendMailRePasswordAdmin({ email });
  if (sendEmailResult.code == 200) {
    res.status(200).redirect("/web");
  } else {
    res.status(404).render("error", {
      layout: false,
      code: 404,
      message: "Không tìm thấy tài khoản!",
    });
  }
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
  jobManagementPage,
  contractManagementPage,
  receiptManagementPage,
  receiptInfoPage,
  statisticPage,
  adminResetPassword,
  updatePasswordPage,
  updateAdminPassword,
};
