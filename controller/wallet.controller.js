const mongoose = require("mongoose");
const walletService = require("../service/wallet.service");

let getWalletInfoOfEndUser = async (req, res) => {
  let { _id } = req.query;
  let queryResult = await walletService.getWalletOfEndUserByCreatedBy({ _id });
  res.status(queryResult.code).send(queryResult.wallet);
};

let payForAcceptedContracts = async (req, res) => {
  let { _id, walletOwnerId, contractIds, jobId } = req.query;

  let paymentResult = await walletService.payForAcceptedContractsProcedure(
    _id,
    walletOwnerId,
    contractIds,
    jobId
  );
  res.status(paymentResult.code).send(paymentResult.result);
};

let getWallByEndUserId = async (req, res) => {
  let { _id } = req.query;
  let wallet = await walletService.getWallByEndUserId({
    _id,
  });
  res.status(wallet.code).send(wallet.wallet);
};

module.exports = {
  getWalletInfoOfEndUser,
  payForAcceptedContracts,
  getWallByEndUserId,
};
