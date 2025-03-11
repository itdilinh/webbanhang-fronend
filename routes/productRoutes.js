const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Thêm sản phẩm mới
router.post("/", async (req, res) => {
  const { name, price, image, stock } = req.body;
  try {
    await pool.query("INSERT INTO products (name, price, image, stock) VALUES (?, ?, ?, ?)", [name, price, image, stock]);
    res.json({ message: "Thêm sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  const { name, price, image, stock } = req.body;
  const productId = req.params.id;
  try {
    await pool.query("UPDATE products SET name = ?, price = ?, image = ?, stock = ? WHERE id = ?", [name, price, image, stock, productId]);
    res.json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
router.get("/", async (req, res) => {
    try {
      let query = "SELECT products.*, categories.name AS category_name FROM products LEFT JOIN categories ON products.category_id = categories.id WHERE 1=1";
      let params = [];
  
      if (req.query.search) {
        query += " AND products.name LIKE ?";
        params.push(`%${req.query.search}%`);
      }
  
      if (req.query.category) {
        query += " AND products.category_id = ?";
        params.push(req.query.category);
      }
  
      const [products] = await pool.query(query, params);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server!" });
    }
  });
  