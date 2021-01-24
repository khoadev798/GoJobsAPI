const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.route");
const questionRoute = require("./routes/question.route");
const freelancerRoute = require("./routes/freelancer.route");
const flcFeedbackRoute = require("./routes/flcFeedback.route");
const empTypeRoute = require("./routes/empType.route");
const jobTypeRoute = require("./routes/jobType.route");
const employerRoute = require("./routes/employer.route");
const sendMailRoute = require("./routes/sendMail.route");

// const sgMail = require("@sendgrid/mail");
// const API_KEY = "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";
// sgMail.setApiKey(API_KEY)
// const msg = {
//   to: 'tran47812@gmail.com', // Change to your recipient
//   from: 'cauhuyso000@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong> <a',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

const jobRoute = require("./routes/job.route");

const otpRoute = require("./routes/otp.route");

const GLOBAL = require("./global/global");

const PORT = GLOBAL.PORT;

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http);

app.use(bodyParser.json({ limit: "15360mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "15360mb",
    extended: true,
    type: "application/json",
    parameterLimit: 5000000,
  })
);

io.on("connection", function (socket) {
  console.log("User Conncetion");

  socket.on("connect user", function (user) {
    console.log("Connected user ");
    io.emit("connect user", user);
  });

  socket.on("on typing", function (typing) {
    console.log("Typing.... ");
    io.emit("on typing", typing);
  });

  socket.on("chat message", function (msg) {
    console.log("Message " + msg["message"]);
    io.emit("chat message", msg);
  });
});

app.get("/", (req, res) => {
  res.send("OK!");
});

app.use("/otp", otpRoute);

app.use("/sendMail", sendMailRoute);

app.use("/user", userRoute);

app.use("/question", questionRoute);

app.use("/freelancer", freelancerRoute);

app.use("/flcFeedback", flcFeedbackRoute);

app.use("/empType", empTypeRoute);

app.use("/employer", employerRoute);

app.use("/job", jobRoute);

app.use("/jobType", jobTypeRoute);

http.listen(PORT, () => {
  console.log(`App is running ${PORT}`);
});
