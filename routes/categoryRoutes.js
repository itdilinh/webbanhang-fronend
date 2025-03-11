const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Lấy danh sách danh mục
router.get("/", async (req, res) => {
  try {
    const [categories] = await pool.query("SELECT * FROM categories");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Thêm danh mục mới
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.json({ message: "Thêm danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Xóa danh mục
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const categoryId = req.params.id;
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [categoryId]);
    res.json({ message: "Xóa danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
