const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");

// Các trường hợp mà contract sẽ sinh ra
// 1. Người dùng follow lẫn nhau : cần có empId, flcId, createdAt, createdBy, contractStatus lúc này là FOLLOW
// Người dùng có thể unfollow và dòng này sẽ bị xoá
// 2. Freelancer thích thú với 1 job nhất định thì họ sẽ đánh dấu star (like) và được đưa vào danh mục yêu thích của họ
// Lúc này contract cần có jobId, flcId createdAt, createBy và contractStatus là INTEREST
// 3. Từ trường hợp thứ 2 có thể update để bỏ quan tâm, dòng này sẽ bị xoá
// 4. Từ trường hợp thứ 2 hoặc ngay từ đầu đã có thể tham gia ứng tuyển vào công việc,
// Lúc này sẽ yêu cầu có các thông tin empId, flcId, jobId, createdAt, createdBy, contractStatus lúc này là APPLIED
// 5. trường hợp người thuê ko chấp nhận sẽ update contractStatus thành REJECTED
// 6. Đang đăng ký nhưng Freelancer tự huỷ đăng ký khi còn đang ở trạng thái APPLIED, dòng này sẽ được xoá
// 7. Employer duyệt đăng ký của Freelancer và tiến hàng làm việc
// ==> Giao dịch chuyển tiền phải được thực hiện với quy trình đã có và Admin update contractStatus này thành APPROVED và tiến hành cho đến kết thúc của Job
// 8. Tất cả mọi chuyện suôn sẻ thuận lợi chuyển contractStatus về COMPLETED và thực hiện quy trình đánh giá
// 9. Vấn đề phát sinh Đã được APPROVED nhưng lại đòi huỷ contract giữa chừng cho dù vì bất kỳ lý do gì
// ==> dùng 1 route hoàn toàn khác để tạo ticket với Admin và admin đóng vai trò gỉai quyết
// Sau khi được giải quyết thì update contractStatus thành CANCELLED

const Contract = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", default: null },
  flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", default: null },
  empId: { type: Schema.Types.ObjectId, ref: "Employer", default: null },
  contractStatus: { type: String, required: true },
  jobStatus: { type: String, default: null },
  createdAt: { type: Date, default: null },
  createdBy: { type: String },
  updatedBy: { type: String },
});

module.exports = Contract;
