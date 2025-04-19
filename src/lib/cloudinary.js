const { v2: cloudinary } = require("cloudinary");
/**  this is same as writing:
 * import {v2 as cloudinary} from "cloudinary"
 */

const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;
