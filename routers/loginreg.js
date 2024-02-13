const express = require("express");
const route = express.Router();
const {login,registration,usersGet,main,loginGet,askAi,addTask,delTask,updateTask} = require("../controllers/controllers");
const {tokenChecker} = require("../Middlewares/authMiddleware");
const {body} = require("express-validator");
route.get("/main",tokenChecker,main);
route.get("/users",usersGet);
route.get("/login",loginGet);
route.post("/registration",[body("username").notEmpty().withMessage("Please enter username"),body("password").isLength({min:4,max:10}).withMessage("Password length should be [4,10]")],registration);
route.post("/login",login);
route.post("/find-complexity",askAi);
route.post("/add",addTask);
route.delete("/delete",delTask)
route.patch("/change",updateTask)


module.exports = {route};