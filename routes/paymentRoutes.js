const express = require("express");
const router = express.Router();
const crypto = require("crypto");
require("dotenv").config();

const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const returnUrl = "http://localhost:3000/payment-success";

router.post("/create-payment", (req, res) => {
  const { amount, orderId } = req.body;
  const createDate = new Date().toISOString().replace(/[-:.TZ]/g, "").substring(0, 14);
  
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100, // VNPay yêu cầu nhân 100
    vnp_ReturnUrl: returnUrl,
    vnp_CreateDate: createDate,
  };

  const sortedParams = Object.keys(vnp_Params).sort().reduce((acc, key) => {
    acc[key] = vnp_Params[key];
    return acc;
  }, {});

  const signData = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${signed}`;
  res.json({ paymentUrl });
});

module.exports = router;
router.get("/payment-return", (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
  
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
  
    const sortedParams = Object.keys(vnp_Params).sort().reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});
  
    const signData = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
    if (secureHash === signed) {
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        res.redirect(`/payment-success?orderId=${vnp_Params["vnp_TxnRef"]}`);
      } else {
        res.redirect(`/payment-failed`);
      }
    } else {
      res.json({ message: "Giao dịch không hợp lệ!" });
    }
  });
  