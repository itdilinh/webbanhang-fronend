const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    console.log(`Email đã gửi đến: ${to}`);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
  }
};

module.exports = sendEmail;
