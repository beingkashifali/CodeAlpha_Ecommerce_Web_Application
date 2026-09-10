const express = require("express");
const { body } = require("express-validator");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Order must have at least one item"),
    body("items.*.productId").isMongoId(),
    body("items.*.quantity").isInt({ min: 1 }),
    body("shippingAddress.street").trim().notEmpty(),
    body("shippingAddress.city").trim().notEmpty(),
    body("shippingAddress.province").trim().notEmpty(),
    body("shippingAddress.phone").trim().notEmpty(),
    body("paymentMethod").isIn(["COD", "JazzCash", "Card"]),
  ],
  validateRequest,
  createOrder,
);

router.get("/myorders", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
