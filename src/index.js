const express = require("express");
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const dotenv = require("dotenv");
const connectDB = require("./lib/db");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
  connectDB();
});
