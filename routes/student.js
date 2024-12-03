var express = require('express');
var router = express.Router();

var student = require("../model/studentModel");
const studentModel = require('../model/studentModel');
const JWT = require('jsonwebtoken');
const config = require("../util/tokenConfig");

// Lấy toàn bộ danh sách sinh viên
router.get("/get_all_student", async function (req, res) {
  try {

    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ "status": false, message: "đã có lỗi xãy ra" + err });
        } else {
          var list = await studentModel.find({});
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

//Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT  
router.get("/get_ all_studen_majo", async function (req, res) {
  try {
    const { m } = req.query;
    var list = await studentModel.find({ BM: { $eq: m } });
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ statas: false, message: " có lỗi xãy ra" + error });
  }
});

//Lấy danh sách sản phẩm có điểm trung bình từ 6.5 dến 8.5
router.get("/get_avg/:minAvg/:maxAvg", async function (req, res) {
  try {
    const { minAvg, maxAvg } = req.params;

    const min = parseFloat(minAvg);
    const max = parseFloat(maxAvg);

    var list = await studentModel.find({ Diem: { $gte: min, $gte: max } });
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ statas: false, message: "Có Lỗi xãy ra" + error });
  }
});

// Tìm kiếm thông tin của sinh viên theo MSSV
router.get("/find_by_mssv", async function (req, res) {
  try {
    const { PS } = req.query;
    var student = await studentModel.find({ MSSV: { $eq: PS } });
    res.status(200).json(student);
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// Thêm mới một sinh viên mới
router.post("/add_new_student", async function (req, res) {
  try {
    const { MSSV, TenHocSinh, Diem, BM, Tuoi } = req.body;

    const newItem = {
      MSSV,
      TenHocSinh,
      Diem,
      BM,
      Tuoi,
    };

    await studentModel.create(newItem);
    res.status(200).json({ status: true, message: "Đã thêm thành công" });
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Thay đổi thông tin sinh viên theo MSSV
router.put("/edit_student_by_MSSV", async function (req, res) {
  try {
    const { MSSV, TenHocSinh, Diem, BM, Tuoi } = req.body;

    var student = await studentModel.findOne({ mssv: { $eq: MSSV } });
    if (student) {
      student.TenHocSinh = TenHocSinh ? TenHocSinh : student.TenHocSinh;
      student.Diem = Diem ? Diem : student.Diem;
      student.BM = BM ? BM : student.BM;
      student.Tuoi = Tuoi ? Tuoi : student.Tuoi;
      await student.save();
      res.status(200).json({ status: true, message: "Đã sửa thành công" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Xóa một sinh viên ra khỏi danh sách
router.delete("/delete_student/:MSSV", async function (req, res) {
  try {
    const { MSSV } = req.params;
    await studentModel.findOneAndDelete({
      MSSV: { $eq: MSSV },
    });
    res.status(200).json({ status: true, message: "Đã xoá thành công" });
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get("/find_student_major_avg/:major/:avg", async function (req, res) {
  try {
    const { major, avg } = req.params;
    const average = parseFloat(avg);
    let list = await studentModel.find({
      major: { $eq: major },
      average: { $gte: average },
    });
    res.status(200).json(list);
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
router.get(
  "/find_student/:minAge/:maxAge/:major/:avg",
  async function (req, res) {
    try {
      const { minAge, maxAge, major, avg } = req.params;

      const min = parseFloat(minAge);
      const max = parseFloat(maxAge);
      const average = parseFloat(avg);

      let list = await studentModel.find({
        date: { $gte: min, $lte: max },
        major: { $eq: major },
        average: { $gte: average },
      });
      res.status(200).json(list);
    } catch (error) {
      res
        .status(404)
        .json({ status: false, message: "Đã có lỗi xảy ra" + error });
    }
  }
);

// Sắp xếp danh sách sinh viên tăng dần theo dtb
router.get("/get_all_student_sort_by_svg", async function (req, res) {
  try {
    var list = await studentModel.find({}).sort({ Diem: 1 });
    res.status(200).json(list);
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
router.get("/student_highest_avg/:BM", async function (req, res) {
  try {
    const { BM } = req.params;
    var listMajor = await studentModel
      .find({ boMon: { $eq: BM } })
      .sort({ diemTB: -1 })
      .limit(1);
    var highestList = await studentModel.find({
      BM: { $eq: boMon },
      diem: { $eq: listMajor[0].Diem },
    });
    res.status(200).json(highestList);
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

module.exports = router;