const companyService = require("../service/company.service");

let registerCompany = async (req, res) => {
  let {
    coTypeId,
    coName,
    coEmail,
    coPassword,
    coPhone,
    coAddress,
    coTaxCode,
    coDescription,
    coLogo,
  } = req.body;
  let companyRegisterResult = await companyService.companyCreate({
    coTypeId,
    coName,
    coEmail,
    coPassword,
    coPhone,
    coAddress,
    coTaxCode,
    coDescription,
    coLogo,
  });
  res.status(companyRegisterResult.code).send(companyRegisterResult.message);
};
let getAllCompanies = (req, res) => {
  res.send("Get all companies!");
};
let updateCompany = (req, res) => {
  res.send("Update company!");
};

module.exports = {
  registerCompany,
  getAllCompanies,
  updateCompany,
};
