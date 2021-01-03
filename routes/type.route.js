const express = require("express");
const route = express.Router();

route.post("/createType", (req,res) =>{
    res.send("Creating type...")
})

route.get("/getAllType", (req, res) =>{
    res.send("Getting all types...")
})

route.delete("/deleteType/:id", (req,res)=>{
    res.send("Deleting...")
})

route.put("/updateType/:id", (req, res)=>{
    res.send("Updating...")
})
