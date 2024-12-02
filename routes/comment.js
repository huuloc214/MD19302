var express = require('express');
var router = express.Router();

var comment = require("../model/commentModel");
const commentModel = require('../model/commentModel');
const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig");

router.get('get_all_message', async function(res, req) {
    try {

        const token = req.header("Authorization").split(' ')[1];
        if (token) {
          JWT.verify(token, config.SECRETKEY, async function (err, id) {
            if (err) {
              res.status(403).json({ "status": false, message: "đã có lỗi xãy ra" + err });
            } else {
              var list = await commentModel.find({});
              res.status(200).json(list);
            }
          });
        } else {
          res.status(401).json({ status: false, message: "không xác thực" });
        } 
    
      } catch (e) {
        res.status(400).json({ statas: false, message: "Có lỗi xãy ra" + e });
      }
});

router.post('add_new_comment', async function(res, req) {
    try{
        const { videoID, channelID, contnet} = res.body;

        const newItem = {
            videoID,
            channelID,
            contnet,
          };
      
          await commentModel.create(newItem);
          res.status(200).json({ status: true, message: "Đã thêm thành công" });
        } catch (error) {
          res
            .status(404)
            .json({ status: false, message: "Đã có lỗi xảy ra" + error });
        }
});

module.exports = router;