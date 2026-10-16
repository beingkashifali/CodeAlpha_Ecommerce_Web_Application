// Run with: npm run seed  (server/.env must be configured first)
// Creates an admin user, a customer, categories, and sample products.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
  ]);

  const salt = await bcrypt.genSalt(12);

  console.log("Creating users...");
  await User.create([
    {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin1234", salt),
      role: "admin",
      phone: "03001234567",
    },
    {
      name: "Ayesha Khan",
      email: "customer@example.com",
      password: await bcrypt.hash("customer1234", salt),
      role: "customer",
      phone: "03007654321",
      address: { street: "12 Model Town", city: "Lahore", province: "Punjab" },
    },
  ]);

  console.log("Creating categories...");
  const categories = await Category.create([
    { name: "Men's Clothing", icon: "shirt" },
    { name: "Women's Clothing", icon: "dress" },
    { name: "Shoes", icon: "footprints" },
    { name: "Electronics", icon: "smartphone" },
    { name: "Home & Kitchen", icon: "home" },
  ]);

  const [mens, womens, shoes, electronics, home] = categories;

  console.log("Creating products...");
  await Product.create([
    {
      name: "Classic Cotton Kurta",
      description:
        "Breathable stitched cotton kurta, perfect for everyday wear.",
      price: 2499,
      discountPrice: 1999,
      stock: 40,
      category: mens._id,
      brand: "Junaid Jamshed",
      isFeatured: true,
      images: [],
    },
    {
      name: "Slim Fit Jeans",
      description: "Stretch denim slim fit jeans, machine washable.",
      price: 3200,
      stock: 25,
      category: mens._id,
      brand: "Outfitters",
      images: [],
    },
    {
      name: "Embroidered Lawn Suit (3pc)",
      description: "Unstitched 3-piece lawn suit with embroidered dupatta.",
      price: 4500,
      discountPrice: 3800,
      stock: 15,
      category: womens._id,
      brand: "Khaadi",
      isFeatured: true,
      images: [],
    },
    {
      name: "Chiffon Formal Dress",
      description: "Ready-to-wear chiffon formal dress for special occasions.",
      price: 6800,
      stock: 10,
      category: womens._id,
      brand: "Sana Safinaz",
      images: [],
    },
    {
      name: "Men's Leather Sneakers",
      description: "Genuine leather sneakers with cushioned sole.",
      price: 5200,
      stock: 30,
      category: shoes._id,
      brand: "Service",
      isFeatured: true,
      images: [],
    },
    {
      name: "Women's Casual Sandals",
      description: "Comfortable everyday sandals with anti-slip sole.",
      price: 1800,
      stock: 5,
      category: shoes._id,
      brand: "Stylo",
      images: [],
    },
    {
      name: "Wireless Bluetooth Earbuds",
      description: "True wireless earbuds with 24-hour battery case.",
      price: 3999,
      discountPrice: 3299,
      stock: 50,
      category: electronics._id,
      brand: "QMobile",
      isFeatured: true,
      images: [],
    },
    {
      name: "Power Bank 20000mAh",
      description: "Fast-charging power bank with dual USB output.",
      price: 2999,
      stock: 3,
      category: electronics._id,
      brand: "Anker",
      images: [],
    },
    {
      name: "Non-Stick Cooking Pan Set",
      description: "5-piece non-stick cookware set, induction compatible.",
      price: 7500,
      stock: 12,
      category: home._id,
      brand: "National",
      images: [],
    },
    {
      name: "Cotton Bedsheet Set",
      description: "King-size 100% cotton bedsheet with 2 pillow covers.",
      price: 2200,
      discountPrice: 1750,
      stock: 20,
      category: home._id,
      brand: "Bonanza Home",
      images: [],
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login: admin@example.com / admin1234");
  console.log("Customer login: customer@example.com / customer1234");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
