const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);
const statsRoutes = require("./routes/statsRoutes");
app.use("/stats", statsRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, isAdmin, async (req, res) => {  });
router.put("/:id", verifyToken, isAdmin, async (req, res) => {  });
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {  });
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/categories", categoryRoutes);
const discountRoutes = require("./routes/discountRoutes");
app.use("/discounts", discountRoutes);
const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);


