const express = require("express");
const authRoutes = require("./routes/auth.route");
const dotenv = require("dotenv");
const connectDB = require("./lib/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
  connectDB();
});
