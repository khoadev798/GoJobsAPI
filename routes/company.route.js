const express = require("express");
const route = express.Router();

route.post("/", (req, res)=>{
    res.send("New Compnay!");
})

module.exports = route;