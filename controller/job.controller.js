const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");
const jwtHelper = require("../helpers/jwt.helper");
const infoValidation = require("../middleware/infoValidation.middle");

const createNewJob = (req, res) => {
  let {} = req.body;
};

module.exports = {
  createNewJob,
};
