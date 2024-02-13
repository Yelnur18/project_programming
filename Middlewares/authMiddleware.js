const jwt = require("jsonwebtoken");
const {secret} = require("../config");

function tokenChecker(req,res,next){
    if(req.method=="OPTIONS"){
        next();
    }
    try{
        let token = req.headers.authorization.split(" ")[1];
        if(token){
            let payload = jwt.verify(token,secret);
            req.user = payload;
            next();
        }else{
            res.status(400).json("No token!");
        }
    }catch(e){
        console.log(e);
        res.status(400).json("Uncaught error!s");
        // next();
    }
}
module.exports = {tokenChecker};