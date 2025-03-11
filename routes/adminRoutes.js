router.get("/stats", async (req, res) => {
    try {
      const conn = await pool.getConnection();
  
      const [totalRevenue] = await conn.query("SELECT SUM(amount) AS revenue FROM orders WHERE status = 'paid'");
      const [totalOrders] = await conn.query("SELECT COUNT(id) AS orders FROM orders WHERE status = 'paid'");
      const [dailyRevenue] = await conn.query(`
        SELECT DATE(created_at) AS date, SUM(amount) AS revenue
        FROM orders
        WHERE status = 'paid'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 7
      `);
  
      conn.release();
      res.json({
        totalRevenue: totalRevenue[0].revenue || 0,
        totalOrders: totalOrders[0].orders || 0,
        dailyRevenue,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server!" });
    }
    router.get("/orders", async (req, res) => {
        try {
          const conn = await pool.getConnection();
      
          const [orders] = await conn.query(`
            SELECT orders.id, users.name AS customer, orders.amount, orders.status, orders.created_at
            FROM orders
            JOIN users ON orders.user_id = users.id
            ORDER BY orders.created_at DESC
          `);
      
          conn.release();
          res.json(orders);
        } catch (error) {
          res.status(500).json({ message: "Lỗi server!" });
        }
      });
      router.get("/orders/:id", async (req, res) => {
        const { id } = req.params;
      
        try {
          const conn = await pool.getConnection();
      
          const [order] = await conn.query(`
            SELECT orders.id, users.name AS customer, users.email, orders.amount, orders.status, orders.created_at
            FROM orders
            JOIN users ON orders.user_id = users.id
            WHERE orders.id = ?
          `, [id]);
      
          const [items] = await conn.query(`
            SELECT products.name, order_items.quantity, products.price
            FROM order_items
            JOIN products ON order_items.product_id = products.id
            WHERE order_items.order_id = ?
          `, [id]);
      
          conn.release();
          res.json({ order: order[0], items });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server!" });
        }
      });
      router.put("/orders/:id/status", async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
      
        try {
          const conn = await pool.getConnection();
          await conn.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
          conn.release();
          res.json({ message: "Cập nhật trạng thái đơn hàng thành công!" });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server!" });
        }
      });
      
      
  });
  