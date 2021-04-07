const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const adminRoute = require("./routes/admin.route");
const freelancerRoute = require("./routes/freelancer.route");
const feedbackRoute = require("./routes/feedback.route");
const employerRoute = require("./routes/employer.route");
const contractRoute = require("./routes/contract.route");
const walletRoute = require("./routes/wallet.route");
const sendMailRoute = require("./routes/sendMail.route");
const locationRoute = require("./routes/location.route");
const swaggerDocument = YAML.load("docs/swagger.yaml");
const jobRoute = require("./routes/job.route");
const otpRoute = require("./routes/otp.route");
const followRoute = require("./routes/follow.route");
const notificationRoute = require("./routes/notification.route");
const messageRoute = require("./routes/messagge.route");
const webAdminRoute = require("./routes/webAdmin.route");
const receiptRoute = require("./routes/receipt.route");
const fs = require("fs");
const GLOBAL = require("./global/global");

const PORT = GLOBAL.PORT || 80;

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http);

const multer = require("multer");

// app.use(bodyParser.urlencoded({ limit: "15360mb", type: "application/json", extended: true }));

app.use(
  express.urlencoded({
    limit: "15360mb",
    extended: true,
    // type: "application/json",
    parameterLimit: 5000000,
  })
);

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(multerMid.single("file"));
app.disable("x-powered-by");
/** Cookies setup here */
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:80"],
    credentials: true,
  })
);

app.use(cookieParser());

/** End of Cookies setup */

// app.use(bodyParser.json({ type: "application/json" }));
// app.use(bodyParser.urlencoded({ extended: true }));
var room;
// io.on("connection", function (socket) {
  
//   socket.on("join", function(room){
//     socket.join(room);
    
//     socket.to(room).on("connect user", function (user) {
//       console.log("Connected user", user);
     
//       io.to(room).emit("connect user", user);
      
//     });
  
//     socket.to(room).on("chat message", function (msg) {
//       console.log("Message " + msg["message"]);
//       console.log(room)
//       io.to(room).emit("chat message", msg);
      
//     });
//   });

// });

io.on("connection", function (socket) {
  let roomName;
  socket.on("join", function(room){
    roomName = room["room"];
    console.log(roomName);
    socket.join(roomName);
    
  });
  // if(roomName == "room1212"){
  //   socket.in("room1212").on("connect user", function (user) {
    
  //     // let roomName1 = room["room"];
  //     io.to("room1212").emit("connect user", user);
      
  //   })
  
  //   socket.in("room1212").on("chat message", function (msg) {
  //     console.log("Message " + msg["message"]);
     
  //     // let roomName = room["room"];
  //     io.to("room1212").emit("chat message", msg);
      
  //   })
  // }else{
    socket.in(roomName).on("connect user", function (user) {
    
      // let roomName1 = room["room"];
      io.to(roomName).emit("connect user", user);
      
    })
  
    socket.in(roomName).on("chat message", function (msg) {
      console.log("Message " + msg["message"]);
     
      // let roomName = room["room"];
      io.to(roomName).emit("chat message", msg);
      
    })
  // }
    
});

app.use(
  "/api-docs",
  function (req, res, next) {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);

app.use("/otp", otpRoute);

app.use("/sendMail", sendMailRoute);

app.use("/admin", adminRoute);

app.use("/freelancer", freelancerRoute);

app.use("/feedback", feedbackRoute);

app.use("/employer", employerRoute);

app.use("/job", jobRoute);

app.use("/contract", contractRoute);

app.use("/wallet", walletRoute);

app.use("/location", locationRoute);

app.use("/follow", followRoute);

app.use("/notification", notificationRoute);

app.use("/message", messageRoute);

app.use("/receipt", receiptRoute);

http.listen(process.env.PORT || PORT, () => {
  console.log(`App is running ${PORT}`);
});

const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const { emit } = require("./model/employer");
const { use } = require("./routes/admin.route");

/**BEGIN OF ADMIN WEBSITE */
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    layoutsDir: __dirname + "/views/layouts/",
    defaultLayout: "layout",
    helpers: require("./util/hbsHelper"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.use("/web", webAdminRoute);

/**END OF ANDMING WEBSITE */
