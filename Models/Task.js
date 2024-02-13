const { Schema, model} = require("mongoose")
const Task = new Schema({
    profileName:{type: String, required:true},
    task: {type: String, required:true},
})
module.exports = model("Task",Task);