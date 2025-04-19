const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const {
  getUsersForSideBar,
  getMessages,
  sendMessages,
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/users", protectRoute, getUsersForSideBar);
router.get("/:id", protectRoute, getMessages);
router.get("/send/:id", protectRoute, sendMessages);

module.exports = router;
