const { v2: cloudinary } = require("cloudinary");
/**  this is same as writing:
 * import {v2 as cloudinary} from "cloudinary"
 */

const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;
