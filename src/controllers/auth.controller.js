const generateToken = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists." });
    }

    //Encrypting passwords:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword });

    if (newUser) {
      //create JWT
      generateToken(newUser._id, res); // it will send the cookie in res
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid user data. Please try again." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // bcoz password was encrypted so we need to compare it using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //if everything is correct then we'll just generate token
    generateToken(user._id, res);
    /**
     * This is another point of diff in auth of todo app and this
     * in todo we generated token only in login
     * that's y even after sign up user had to login khudse.
     * but here token is generated in both signup and login so user wont have to signup->login both.
     */

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: "0" });
    /**
     * in todo app we just had the jwt stored in chome's local storage
     * so in logout logic we just cleared that.
     * here bcoz jwt is stored as cookies
     * so to logout we are just clearing the cookies.
     */

    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: "Profile pic is required." });
    }

    const cloudinaryUpload = await cloudinary.uploader.upload(profilePic);

    const updatedUser = User.findOneAndUpdate(
      userId,
      { profilePic: cloudinaryUpload.secure_url }, //cloudinary stores image as secure_url
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user); // from protectedRoute middleware *REMEBERRRRRRR*.
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
