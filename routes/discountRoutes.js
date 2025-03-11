const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/apply", async (req, res) => {
  const { code } = req.body;
  try {
    const [discounts] = await pool.query("SELECT * FROM discounts WHERE code = ? AND expiry_date > NOW()", [code]);

    if (discounts.length === 0) return res.status(400).json({ message: "Mã giảm giá không hợp lệ!" });

    res.json({ discount: discounts[0].discount_percent });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
