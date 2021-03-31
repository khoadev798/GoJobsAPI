const receiptService = require("../service/receipt.service");

let getReceiptHistory = async (req, res) =>{
    let {_id} = req.query;
    let getReceiptHistoryResult = await receiptService.getReceiptHistory({_id});
    res.status(getReceiptHistoryResult.code).send(getReceiptHistoryResult.history);
}

module.exports = {
    getReceiptHistory
}