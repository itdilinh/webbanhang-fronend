const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(401).json({ message: "Tài khoản không tồn tại!" });

    const user = users[0];
    if (user.password !== password) return res.status(401).json({ message: "Mật khẩu không đúng!" });

    // Tạo token chứa role
    const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", { expiresIn: "7d" });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});
