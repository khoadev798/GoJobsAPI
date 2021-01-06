let registerCompany = (req, res) => {
  res.send("Registering company!");
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
