require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middleware/errormiddleware.js");
const port = process.env.PORT;

const authRoutes = require("./routes/authRoutes.js");

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Application is Up and running on port ${port}.`);
});
