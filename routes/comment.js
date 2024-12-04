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
    const { videoID, channelID, content } = req.body;

    const newComment = {
      videoID,
      channelID,
      content,
    };

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
    await commentModel.findOneAndDelete({
      videoID: { $eq: videoID },
    });
    res.status(200).json({ status: true, message: "Đã xoá thành công" });
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

router.put("/edit_comment_by_videoID", async function (req, res) {
  try {
    const { videoID, channelID, content } = req.body;

    if (!videoID) {
      return res
        .status(400)
        .json({ status: false, message: "videoID là bắt buộc." });
    }

    const updatedComment = await commentModel.findOneAndUpdate(
      { videoID: videoID }, // Tìm comment dựa trên videoID
      {
        $set: {
          channelID: channelID || undefined, // Chỉ cập nhật nếu có giá trị mới
          content: content || undefined,
        },
      },
      { new: true } // Trả về comment đã được cập nhật
    );

    if (!updatedComment) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy comment." });
    }

    res.status(200).json({ status: true, message: "Đã sửa thành công", updatedComment });
  } catch (error) {
    res.status(500).json({ status: false, message: "Đã có lỗi xảy ra: " + error.message });
  }
});


router.get("/find_by_VideoID", async function (req, res) {
  try {
    const { videoID } = req.query;
    var comment = await commentModel.find({ videoID: { $eq: videoID } });
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});


module.exports = router;