const express = require("express");
const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} = require("../controllers/auth.controller");
const protectRoute = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
/**
 * the protect route middleware will check if the user exists or not.
 * if the user does not exist then it will not allow the browser to access /update-profile route
 */

router.get("/check", protectRoute, checkAuth); // this will chk if user is authenticated or not.

module.exports = router;
