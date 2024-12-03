var express = require('express');
var router = express.Router();

const commentModel = require('../model/commentModel');
const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig");

router.get('/get_all_Comment', async function(req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(400).json({ "status": false, message: "đã có lỗi xãy ra" + err });
        } else {
          var list = await commentModel.find({});
          res.status(200).json(list);
        }
      });
    } else {
      res.status(400).json({ status: false, message: "không xác thực" });
    } 
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xãy ra" + e });
  }
});

router.post("/add_new_comment", async function (req, res) {
  try {
    // const { videoID, channelID, content } = req.body;

    // const newComment = {
    //   videoID,
    //   channelID,
    //   content,
    // };

    await commentModel.create(newComment);
    res.status(200).json({ status: true, message: "Đã thêm thành công" });
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

router.delete("/delete_Comment/:videoID", async function (req, res) {
  try {
    const { videoID } = req.params;
    await c.findOneAndDelete({
      videoID: { $eq: videoID },
    });
    res.status(200).json({ status: true, message: "Đã xoá thành công" });
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

router.put("/edit_comment_by_ID", async function (req, res) {
  try {
    const { videoID, channelID, content } = req.body;

    var comment = await commentModel.findOne({ videoID: { $eq: videoID } });
    if (comment) {
      comment.videoID = videoID ? videoID : comment.videoID;
      comment.channelID = channelID ? channelID : comment.channelID;
      comment.content = content ? content : comment.content;
      await comment.save();
      res.status(200).json({ status: true, message: "Đã sửa thành công" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});


module.exports = router;