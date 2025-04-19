const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user.model");
dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    /**
     * to check if the user is there or not, we will access token from the cookies that we saved.
     * req.cookies.jwt ---> jwt bcoz we named out cookie as jwt (utils.js line 11)
     */
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token found." });
    }

    /**
     * So if the token is present then we need to check if the token is valid or not.
     * when a jwt token is stored as cookie then it gets encrypted automatically
     * then we first need to de-crypt the token
     * for this we use a package known as cookie-parser (configured in index.js)
     */

    /**
     * OKAY so we need to understand what our cookie contains.
     * our cookie ---contain--> JWT ---contain--> userId
     * yes we did set that in utils.js line no.: 6
     */

    const decryptedKey = jwt.verify(token, process.env.JWT_SECRET);

    if (!decryptedKey) {
      return res
        .status(401)
        .json({ messag: "Unauthorized: No valid token found." });
    }

    const user = await User.findById(decryptedKey.userId).select("-password"); // select everything except pass

    req.user = user;
    // Now any route using this middleware can access req.user to get the logged-in user's data.

    next();


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error." });
  }
};

module.exports = protectRoute;
