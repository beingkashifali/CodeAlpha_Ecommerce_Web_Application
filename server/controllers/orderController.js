const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @route POST /api/orders
// Re-validates prices and stock on the server. Never trusts totals from the browser.
//
// Note: this uses a conditional atomic decrement per item (findOneAndUpdate with a
// stock >= quantity filter) rather than a multi-document transaction, because
// transactions require MongoDB to be run as a replica set, which a beginner's local
// standalone `mongod` usually isn't. If a later item in the same order fails (e.g.
// out of stock), earlier decrements in this request are rolled back manually below.
const createOrder = async (req, res, next) => {
  const decremented = []; // { productId, quantity } already deducted, for rollback

  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const reqItem of items) {
      const product = await Product.findById(reqItem.productId);
      if (!product) {
        throw Object.assign(
          new Error(`Product not found: ${reqItem.productId}`),
          {
            statusCode: 404,
          },
        );
      }

      // Atomic: only decrements if enough stock is still available right now.
      const updated = await Product.findOneAndUpdate(
        {
          _id: product._id,
          stock: { $gte: reqItem.quantity },
        },
        { $inc: { stock: -reqItem.quantity } },
        { new: true },
      );

      if (!updated) {
        throw Object.assign(
          new Error(`Insufficient stock for ${product.name}`),
          { statusCode: 400 },
        );
      }

      decremented.push({
        productId: product._id,
        quantity: reqItem.quantity,
      });

      const unitPrice = product.discountPrice ?? product.unitPrice;
      totalPrice += unitPrice * reqItem.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: unitPrice,
        quantity: reqItem.quantity,
        image: product.images?.[0] || "",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      totalPrice,
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    // Roll back any stock we already decremented before the failure.
    for (const d of decremented) {
      await Product.findOneAndUpdate(d.productId, {
        $inc: { stock: d.quantity },
      });
    }
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

// @route GET /api/orders/myorders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
