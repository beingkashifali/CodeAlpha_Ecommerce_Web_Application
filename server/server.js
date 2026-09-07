require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middleware/errormiddleware.js");

const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Application is Up and running on port ${port}.`);
});
