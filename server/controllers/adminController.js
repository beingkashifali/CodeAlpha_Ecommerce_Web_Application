const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");

// ---------- Dashboard ----------

// @route GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalProducts, totalCustomers, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.find(),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "COD")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const orderByStatus = orders.reduce((acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
      return acc;
    });
  } catch (error) {
    next(error);
  }
};

// ---------- Products ----------

// @route GET /api/admin/products

const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/products/:id

const getAdminProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/admin/products  (multipart/form-data, field "images")
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      isFeatured,
    } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "Bazario/products" },
          ),
        ),
      );
      images = uploads.map((url) => url.secure_url);
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      stock,
      category,
      brand,
      isFeatured: isFeatured === "true" || isFeatured === true,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      isFeatured,
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined)
      product.discountPrice = discountPrice || null;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (isFeatured !== undefined)
      product.isFeatured = isFeatured === "true" || isFeatured === true;

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "Bazario/products" },
          ),
        ),
      );
      product.images = [
        ...product.images,
        ...uploads.map((url) => url.secure_url),
      ];
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

// ---------- Categories ----------

// @route POST /api/admin/categories
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      icon: req.body.icon || "",
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// ---------- Orders ----------

// @route GET /api/admin/orders
const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/orders/:id
const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone",
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/orders/:id/status  { orderStatus } or { paymentStatus }
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) res.status(404).json({ message: "Order not found" });

    const { orderStatus, paymentStatus } = req.body;
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ---------- Users ----------

// @route GET /api/admin/users
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const orderCounts = await Order.aggregate([
      { $group: { $_id: "$user", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      orderCounts.map((o) => [o._id.toString(), o.count]),
    );

    const result = users.map((u) => ({
      ...u.toObject(),
      orderCount: countMap[u._id.toString()] || 0,
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/users/:id  { role, isBlocked }
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ message: "User not found" });

    const { role, isBlocked } = req.body;
    if (role) user.role = role;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isBlocked: updated.isBlocked,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
