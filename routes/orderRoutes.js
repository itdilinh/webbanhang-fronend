const express = require("express");
const router = express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");

router.post("/", createOrder); // Tạo đơn hàng
router.get("/:userId", getOrders); // Lấy danh sách đơn hàng của user

module.exports = router;
const express = require("express");

const pool = require("../config/db");

// Lấy danh sách tất cả đơn hàng (chỉ Admin mới có quyền)
router.get("/", async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, u.username 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Lấy chi tiết đơn hàng theo ID
router.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  try {
    const [order] = await pool.query(`
      SELECT o.*, u.username 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.image 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    if (order.length > 0) {
      res.json({ order: order[0], items });
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Cập nhật trạng thái đơn hàng
router.put("/:id", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
router.post("/", async (req, res) => {
    const { user_id, items } = req.body;
    try {
      const conn = await pool.getConnection();
      await conn.beginTransaction();
  
      for (let item of items) {
        const [product] = await conn.query("SELECT stock FROM products WHERE id = ?", [item.id]);
        if (product[0].stock < item.quantity) {
          await conn.rollback();
          return res.status(400).json({ message: `Sản phẩm ${item.name} không đủ hàng!` });
        }
        await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.id]);
      }
  
      await conn.query("INSERT INTO orders (user_id) VALUES (?)", [user_id]);
      const [order] = await conn.query("SELECT LAST_INSERT_ID() AS order_id");
      for (let item of items) {
        await conn.query("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)", [order[0].order_id, item.id, item.quantity]);
      }
  
      await conn.commit();
      conn.release();
      res.json({ message: "Đặt hàng thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server!" });
    }
    const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const sendEmail = require("../utils/email");

router.post("/create", async (req, res) => {
  const { user_id, products, total } = req.body;

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query("INSERT INTO orders (user_id, amount, status) VALUES (?, ?, ?)", [user_id, total, "pending"]);
    const order_id = result.insertId;

    for (const product of products) {
      await conn.query("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)", [order_id, product.id, product.quantity]);
    }

    conn.release();

    // Lấy email khách hàng
    const [user] = await pool.query("SELECT email FROM users WHERE id = ?", [user_id]);
    const customerEmail = user[0]?.email;

    // Gửi email cho Admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "Đơn hàng mới vừa được đặt!",
      `<p>Đơn hàng #${order_id} đã được tạo.</p><p>Tổng tiền: ${total} VND</p>`
    );

    // Gửi email cho Khách hàng
    if (customerEmail) {
      await sendEmail(
        customerEmail,
        "Xác nhận đơn hàng",
        `<p>Cảm ơn bạn đã đặt hàng! Đơn hàng #${order_id} sẽ được xử lý sớm.</p><p>Tổng tiền: ${total} VND</p>`
      );
    }

    res.json({ message: "Đặt hàng thành công!", order_id });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;

  });
  
  

