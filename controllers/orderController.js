const db = require("../config/db");

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
  const { userId, items, totalPrice } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)",
      [userId, totalPrice, "pending"]
    );

    const orderId = result.insertId;
    for (const item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.json({ message: "Đơn hàng đã được tạo", orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách đơn hàng của user
exports.getOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await db.execute("SELECT * FROM orders WHERE user_id = ?", [userId]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
