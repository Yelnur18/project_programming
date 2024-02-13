const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const cors = require("cors");
const {route} = require("./routers/loginreg");

app.use(cors());
app.options("/users",cors())
app.use(express.json());
app.use(express.static("./public"))
app.use("/",route); 

 

const start = async () =>{
    mongoose.connect("mongodb+srv://@cluster0.x2eea6u.mongodb.net/DoWAI?retryWrites=true&w=majority") 
    app.listen(3000,()=>{
    console.log("Running on port 3000");
    })
};
start();
