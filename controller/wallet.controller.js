const mongoose = require("mongoose");
const walletService = require("../service/wallet.service");

let getWalletInfoOfEndUser = async (req, res) => {
  let { _id } = req.query;
  let queryResult = await walletService.getWalletOfEndUserByCreatedBy({ _id });
  res.status(queryResult.code).send(queryResult.wallet);
};

let payForAcceptedContracts = async (req, res) => {
  let { _id, walletOwnerId, contractIds, jobId } = req.query;

  // contractIds.forEach((id) => {
  //   id = mongoose.Types.ObjectId(id);
  //   return id;
  // });
  // console.log(contractIds);

  let paymentResult = await walletService.payForAcceptedContractsProcedure(
    _id,
    walletOwnerId,
    contractIds,
    jobId
  );
  res.status(paymentResult.code).send(paymentResult.result);
};

// let updateWalletBalanceByIdByAdmin = async (req, res) => {
//   let { _id, balance, updatedBy } = req.body;

//   let updatedWalletResult = await walletService.updateWalletBalanceById({
//     _id,
//     balance,
//     updatedBy,
//   });
// };

module.exports = {
  getWalletInfoOfEndUser,
  payForAcceptedContracts,
};
