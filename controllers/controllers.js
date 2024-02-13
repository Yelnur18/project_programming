const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Task = require("../Models/Task");
const jwt = require("jsonwebtoken");
const {secret} = require("../config.js");
const OpenAI = require('openai');
const { validationResult } = require("express-validator");

function generateAccess(id,username){
    let payload = {id,username};
    return jwt.sign(payload,secret,{expiresIn:"24h"})
}
const openai = new OpenAI({
  apiKey: "your-api-key"
});

const chatGPT = async(content,option)=>{
    let message = option=="Split" ? `My task title is: {${content}}.
    Create 4 subtasks no more than few words each, to complete the task. Write like 1.First subtask /n 2.Second subtask. etc. Keep an eye on the value of the subtasks.` : `Create overall short definition of the task by title: {${content}}.No more than 2 short sentences
    Skip the part of writing "Here are hints" or smh like that, get straight to the point.`
const chatCompletion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{"role": "user", "content": message}],
  max_tokens: 150,
});
return chatCompletion.choices[0].message.content;
};


const login = async (req,res)=>{
    let {username, password} = req.body;
    let user = await User.findOne({
        username: username
    })
    if(user){
        let result = await bcrypt.compare(password,user.password);
        console.log(user)
        if(result){
            let token = generateAccess(user._id,user.username);
            return res.status(200).json({authorization:token});
        }else{
            return res.status(400).json("Incorrect password");
        }
    }else{
        console.log(user)
        return res.status(404).json("No such account found");
    }
}
const loginGet = (req,res)=>{
    res.status(200).sendFile(path.resolve(__dirname,"../public/index.html"));
}

const registration = async (req,res)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.errors);
    }
    let {username, password} = req.body
    let result = await User.findOne({username});
    if(result){
        console.log(result);
        return res.status(200).json("Already exist");
    }else{
    let hashedPassword = await bcrypt.hash(password,10);
    let newUser = new User({
        username: username,
        password: hashedPassword
    })
    newUser.save();
    console.log(User);
    res.status(201).json("Account was created!");
    }
}
const usersGet = (req,res)=>{
    res.status(200).json(req.user);
}
const main = async (req,res)=>{
    let taskFound = await Task.find({profileName: req.user.username})
    req.user.tasks = taskFound
    res.json({
        "info":req.user
    })
}

const askAi = async (req, res)=>{
    try{
      const data = req.body;
      let resp = await chatGPT(req.body.key,req.body.option);
  
      console.log(data)
       
      return res.status(200).send(resp);
    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Ошибка" });
    }
  }

const addTask = (req,res) =>{
    let {profileName,task} = req.body
    try{
        let newTask = new Task({
        profileName,task
    })
    newTask.save();
    res.json({"message":"Удачно добавлено!"})
}
catch(e){
        res.status(500).json({"message":e})
    }
}

const delTask = async (req,res) =>{
    let {profileName, task} = req.body;
    console.log(req.body)
    try{
    let result = await Task.deleteOne({profileName,task});
    if(result.deletedCount===1){
    res.status(200).json({"Success":"Deleted!"});
    }else{
        res.status(404).json({"error":"Not found!"});
    }
    }catch(e){
        res.status(500).json({"message":"Couldn`t delete"})
    }
}   

const updateTask = async (req,res) =>{
    try{
        let { profileName, task, updatedTask } = req.body;
        task = JSON.stringify(task)
        updatedTask = JSON.stringify(updatedTask)
        let result = await Task.updateOne({
            profileName:profileName,
            task:task
        },{
            $set:{task: updatedTask}
        })
        if(result){
            console.log(profileName)
            console.log(task)
            console.log(result)
            res.status(200).json({"message":"nice"})
        }else{
            res.status(404).json({"error":"nice"})
        }
    }catch(e){
        console.log(e)
    }
}

module.exports = {login,registration,usersGet,main,loginGet,askAi,addTask,delTask,updateTask}





























// const path = require("path");
// const bcrypt = require("bcrypt");
// const User = require("../Models/User");
// const { validationResult } = require("express-validator");
// let users = [{
//     username: "Sasha",
//     password: "sashapasha"
// }]
// let logined = [];
// console.log(users);

// const login = async (req,res)=>{
//     let errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json(errors.errors);
//     }
//     let {username, password} = req.body;
//     let user = users.find(x=>(x.username === username)&&(bcrypt.compare(password,x.password)));
//     if(user){
//         let result = await bcrypt.compare(password,user.password);
//         console.log(result,user)
//         if(result){
//             return res.status(200).json("Authorised successfully!");
//         }else{
//             return res.status(400).json("Incorrect password");
//         }
//     }else{
//         console.log(user)
//         return res.status(404).json("No such account found");
//     }
// }
// const loginGet = (req,res)=>{
//     res.sendFile(path.resolve(__dirname,"../public/index.html"));
// }

// const registration = async (req,res)=>{
//     let errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json(errors.errors);
//     }
//     let {username, password} = req.body
//     const user = {
//         username: username,
//         password: password
//     }
//     let result = users.find((x)=>{
//         return x.username == user.username;
//     });
//     console.log(result)
//     if(result){
//         return res.status(200).json("Already exist");
//     }else{
//         let hashedPassword = await bcrypt.hash(password,10);
//         User.create({
//             username: username,
//             password: hashedPassword
//         })
//     users.push({
//         username: username,
//         password: hashedPassword
//     })
//     res.status(201).json("Account was created!");
//     }
// }
// const usersGet = (req,res)=>{
//     res.redirect("/login");
// }
// const main = (req,res)=>{
//     res.send("Main page");
// }

// module.exports = {login,registration,usersGet,main,loginGet}
