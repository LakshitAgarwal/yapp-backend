const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //now after generating the token we will store this token in cookies in out browser
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httponly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV != "development",
  });

  /**
   * Here's what each option means:
   * jwt:	Name of the cookie
   * token:	The actual JWT value
   * maxAge:	Cookie expires in 7 days
   * httpOnly:	✅ Important — JavaScript on the frontend cannot access this cookie (protects against XSS attacks)
   * sameSite: 'strict'	Helps prevent CSRF attacks by blocking cross-origin requests from sending this cookie
   * secure:	Only allows cookie over HTTPS in production (not needed in dev)

   */

  /**
   * Q: why to store JWT in cookies and not in browser's local storage like we did in ToDo app?
   * 
   * Ans: localStorage (Old Way)	    HTTP-only Cookie (This Way)
          Accessible by JS (XSS risk)	Not accessible by JS
          You have to manually attach 
          it in headers	                Auto-attached with every request
          Easier for hackers to steal 
          if XSS	                    Safer
          CSRF protection needs more 
          setup	                        sameSite and httpOnly help a lot
   */

  return token;
};
module.exports = generateToken;
