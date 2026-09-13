const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  getStats,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminUsers,
  updateUser,
} = require("../controllers/adminController");

const router = express.Router();

// Every route below requires a logged-in admin — checked server-side, not just hidden in the UI.
router.use(protect, admin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

router.get("/stats", getStats);
router.get("/products", getAdminProducts);
router.get("/products/:id", getAdminProductById);
router.post(
  "/products",
  upload.array("images", 6),
  [
    body("name").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("stock").isInt({ min: 0 }),
    body("category").isMongoId(),
  ],
  validateRequest,
  createProduct,
);

router.put("/products/:id", upload.array("images", 6), updateProduct);
router.delete("/products/:id", deleteProduct);

router.post(
  "/categories",
  [body("name").trim().notEmpty()],
  validateRequest,
  createCategory,
);

router.get("/orders", getAdminOrders);
router.get("/orders/:id", getAdminOrderById);
router.put(
  "/orders/:id/status",
  [
    body("orderStatus")
      .optional()
      .isIn(["pending", "processing", "shipped", "delivered", "cancelled"]),
    body("paymentStatus").optional().isIn(["pending", "paid", "failed"]),
  ],
  validateRequest,
  updateOrderStatus,
);

router.get("/users", getAdminUsers);
router.put(
  "/users/:id",
  [
    body("role").optional().isIn(["customer", "admin"]),
    body("isBlocked").optional().isBoolean(),
  ],
  validateRequest,
  updateUser,
);

module.exports = router;
