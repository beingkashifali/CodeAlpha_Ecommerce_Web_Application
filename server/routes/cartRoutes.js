const express = require("express");
const { body } = require("express-validator");
const {
  getCart,
  addToCart,
  mergeCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController.js");
const protect = require("../middleware/authMiddleware.js");
const validateRequest = require("../middleware/validateRequest.js");

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post(
  "/",
  [
    body("productId").isMongoId(),
    body("quantity").optional().isInt({ min: 1 }),
  ],
  validateRequest,
  addToCart,
);
router.post("/merge", mergeCart);
router.put(
  "/:productId",
  [body("quantity").isInt({ min: 0 })],
  validateRequest,
  updateCartItem,
);
router.delete("/:productId", removeCartItem);

module.exports = router;
