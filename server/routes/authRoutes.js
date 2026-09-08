const express = require("express");
const { body } = require("express-validator");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware.js");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone").optional().trim(),
  ],
  validateRequest,
  registerUser,
);

router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser,
);

router.post("/logout", logoutUser);
router.get("/", protect, getMe);
router.put(
  "/profile",
  protect,
  [body("name").optional().trim().notEmpty(), body("phone").optional().trim()],
  validateRequest,
  updateProfile,
);

module.exports = router;
