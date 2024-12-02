const nodemailer = require("nodemailer");
var express = require("express");
var router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "aikido2142005@gmail.com",
    pass: "udcu uzed rvbg uzqz",
  },
});

router.post("/send_mail", async function (req, res, next) {
  try {
    const { to, subject, content } = req.body;

    const mailOptions = {
      from: " loc <aikido2142005@gmail.com>",
      to: to,
      subject: subject,
      html: content,
    };
    await transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Gửi mail thất bại" + err });
  }
});

module.exports = router;