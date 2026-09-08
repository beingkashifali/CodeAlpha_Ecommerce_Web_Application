const Cart = require("../models/Cart");
const Product = require("../models/Product");

const populateCart = (query) =>
  query.populate("items.product", "name slug price discountPrice images stock");

// @route GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await populateCart(Cart.findOne({ user: req.user._id }));
    if (!cart) {
      cart = await new Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/cart  { productId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() == productId,
    );
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/cart/:productId  { quantity }
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.quantity;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId,
    );
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = Number(quantity);
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== req.params.productId,
      );
    }

    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/cart/:productId
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId,
    );

    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/cart/merge  { items: [{ productId, quantity }] }
// Merges a guest (localStorage) cart into the server cart on login.
const mergeCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    for (const guestItem of items) {
      const existing = cart.items.find(
        (i) => i.product.toString() === guestItem.productId,
      );

      if (existing) {
        existing.quantity += Number(guestItem.quantity);
      } else {
        cart.items.push({
          product: guestItem.productId,
          quantity: Number(guestItem.quantity),
        });
      }
    }

    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  mergeCart,
};
