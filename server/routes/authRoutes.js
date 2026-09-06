const express = require("express");
const { body } = require("express-validator");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerUser } = require("../controllers/authController");
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

module.exports = router;
