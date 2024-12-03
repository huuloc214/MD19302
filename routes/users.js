

var express = require('express');
var router = express.Router();
const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig");
var userModel = require('../model/userModel');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", async function(req, res){
  try{
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});
    if(checkUser == null){
      res.status(200).json,{status: false, message: "Username đăng nhập thành công"}
    }else{
      const token = JWT.sign({username: username}, config.SECRETKEY, {expiresIn: '1h'});
      const refreshToken = JWT.sign({username: username}, config.SECRETKEY, {expiresIn: '1d'});

      res.status(200).json({status: true, message:"Đăng nhập thành công", token: token, refreshToken: refreshToken});
    }
  }catch(e){
    res.status(400).json({status: false, message: "Username đăng nhập không thành công"});
  }
});

module.exports = router;