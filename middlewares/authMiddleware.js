const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Bạn chưa đăng nhập!" });

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  next();
};

module.exports = { verifyToken, isAdmin };
