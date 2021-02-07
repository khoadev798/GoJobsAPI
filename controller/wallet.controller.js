const mongoose = require("mongoose");
const walletService = require("../service/wallet.service");

let getWalletInfoOfEndUser = async (req, res) => {
  let { _id } = req.query;
  let queryResult = await walletService.getWalletOfEndUserByCreatedBy({ _id });
  res.status(queryResult.code).send(queryResult.wallet);
};

let payForAcceptedContracts = async (req, res) => {
  let { _id, walletOwnerId, contractIds } = req.query;
  console.log(contractIds instanceof Array);
  contractIds.forEach((id) => {
    id = mongoose.Types.ObjectId(id);
  });
  let paymentResult = await walletService.payForAcceptedContractsProcedure(
    _id,
    walletOwnerId,
    contractIds
  );
  res.send("Procedure");
};
module.exports = { getWalletInfoOfEndUser, payForAcceptedContracts };
