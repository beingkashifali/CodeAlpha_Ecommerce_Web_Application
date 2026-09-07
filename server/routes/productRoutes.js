const express = require("express");
const {
  getCategories,
  getProducts,
  getProductBySlug,
} = require("../controllers/productController");

const router = express.Router();

router.get("/categories/all", getCategories);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

module.exports = router;
