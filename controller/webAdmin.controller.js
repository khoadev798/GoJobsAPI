const adminService = require("../service/admin.service");
const employerService = require("../service/employer.service");
const freelancerService = require("../service/freelancer.service");
const walletService = require("../service//wallet.service");
const jobService = require("../service/job.service");
const contractService = require("../service/contract.service");
const receiptService = require("../service/receipt.service");
const jwtHelper = require("../helpers/jwt.helper");
let alert = require("alert");

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

let jobManagementPage = async (req, res) => {
  let { search, sort, filter, pageNumber, pageSize } = req.query;
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!pageSize) {
    pageSize = 5;
  }
  let jobPaginationForWebAdmin = await jobService.jobPaginationForWebAdmin({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });
  let jobList = jobPaginationForWebAdmin.jobs;
  let pageCount = jobPaginationForWebAdmin.pageCount;
  console.log(jobList.length);
  res.render("job/tableJob", {
    layout: "layout",
    title: "Job",
    admin: req.admin,
    jobList,
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

let contractManagementPage = async (req, res) => {
  let { jobId, search, sort, filter, pageNumber, pageSize } = req.query;
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
      filter,
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
        ["APLLIED", 0],
        ["APPROVED", 0],
        ["ACCEPTED", 0],
        ["REJECTED", 0],
        ["COMPLETED", 0],
        ["CANCELLED", 0],
      ],
    };

    contractList.forEach((contract) => {
      if (contract.contractStatus == "APPROVED") {
        statusArray.array[1][1] = statusArray.array[1][1] + 1;
      }
      if (contract.contractStatus == "APPLIED") {
        statusArray.array[1][1] = statusArray.array[1][1] + 1;
      }
      if (contract.contractStatus == "ACCPETED") {
        statusArray.array[2][2] = statusArray.array[2][2] + 1;
      }
      if (contract.contractStatus == "REJECTED") {
        statusArray.array[3][3] = statusArray.array[3][3] + 1;
      }
      if (contract.contractStatus == "COMPLETED") {
        statusArray.array[4][4] = statusArray.array[4][4] + 1;
      }
      if (contract.contractStatus == "CANCELLED") {
        statusArray.array[5][5] = statusArray.array[5][5] + 1;
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
      helpers: {
        forInRange: function (from, to, incr, block) {
          var accum = "";
          for (var i = from; i <= to; i += incr) accum += block.fn(i);
          return accum;
        },
      },
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
    from = new Date("2000-01=01");
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
      pageSize,
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
    helpers: {
      forInRange: function (from, to, incr, block) {
        var accum = "";
        for (var i = from; i <= to; i += incr) accum += block.fn(i);
        return accum;
      },
    },
  });
};

let receiptInfoPage = async (req, res) => {
  let { _id } = req.query;

  let receiptInfo = await receiptService.receiptInfoForWebAdmin({
    _id,
  });
  let receipt = receiptInfo.receipt;
  console.log(receipt);
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
  // res.send(queryResult);
  receipts.forEach((receipt) => {
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
    chartInfoList.info.push({
      name: "OK",
      steps: 20000,
    });
  });
  res.render("statistic/statistic", {
    layout: "layout",
    title: "Statistic",
    admin: req.admin,
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
  console.log(updateWalletResult);
  // if (updateWalletResult.code == 200) {
  res.redirect(`/web/freelancer?search=${flcEmail}`);
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
  jobManagementPage,
  contractManagementPage,
  receiptManagementPage,
  receiptInfoPage,
  statisticPage,
};
