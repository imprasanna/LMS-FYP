const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Routes = require("./routes/route"); // Correctly reference your `route.js`
const morgan = require('morgan')
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

// Middleware
app.use(express.json({ limit: "10mb" })); // Handle JSON request payload
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(morgan('dev'));
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// API Routes
app.use("/", Routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
