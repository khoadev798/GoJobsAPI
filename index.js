const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.route");
const questionRoute = require("./routes/question.route");
const freelancerRoute = require("./routes/freelancer.route");
const flcFeedbackRoute = require("./routes/flcFeedback.route");
const empTypeRoute = require("./routes/empType.route");
const jobTypeRoute = require("./routes/jobType.route");
const employerRoute = require("./routes/employer.route");

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