const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Lấy tổng số đơn hàng và doanh thu
router.get("/overview", async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT COUNT(id) as total_orders, SUM(total_price) as revenue FROM orders WHERE status = 'completed'
    `);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Lấy doanh thu theo ngày
router.get("/daily", async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT DATE(created_at) as date, SUM(total_price) as revenue 
      FROM orders WHERE status = 'completed'
      GROUP BY DATE(created_at) ORDER BY date DESC
    `);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Lấy doanh thu theo tháng
router.get("/monthly", async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_price) as revenue 
      FROM orders WHERE status = 'completed'
      GROUP BY year, month ORDER BY year DESC, month DESC
    `);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
