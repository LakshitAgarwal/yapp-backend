const Message = require("../models/message.model");
const User = require("../models/user.model");
const cloudinary = require("../lib/cloudinary");
const { getSocketIdByUserId, io } = require("../lib/socket");

const getUsersForSideBar = async (req, res) => {
  try {
    /**
     * Okay so here we are fetching every single user to be displayed in the list of ppl to chat with
     * but we need to keep in mind that list should contain ALL EXCEPT yourself.
     */
    const loggedInUser = req.user._id;
    const filterusers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    /**
     * User.find({ _id: { $ne: loggedInUser } }) (this is mongo syntax cant do much)
     * this means find all user with id NOT EQUAL (ne) to loggedInUser
     * .select(-password) means store all info about that user in filteruser except password
     */

    res.status(200).json(filterusers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getMessages = async (req, res) => {
  try {
    //So we will need to first get the id of both the parties who are texting each other.

    const { id: userToChatWith } = req.params;
    const myId = req.user._id;

    // now getting all the messages from these user:
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatWith },
        { senderId: userToChatWith, recieverId: myId },
      ],
    });

    /**
   * okay lets understand this:
   * Message.find({
    $or:[
        {},{} ------> return data which matches either of them. its an or function.
    ]
  })
    this is mongoose code for finding in db.
   
        { senderId: myId, recieverId: userToChatWith },
        { senderId: userToChatWith, recieverId: myId },
    
    get messages where either i am sender and saamne wala is reciever
    OR
    get messages where saamne wala is sender and i am reciever.
   
    */

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error." });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { id: userToChatWith } = req.params;
    const myId = req.user._id;
    //We need to understand that both text and image is possible as a message.
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const cloudinaryUpload = await cloudinary.uploader.upload(image);
      imageUrl = cloudinaryUpload.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      recieverId: userToChatWith,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getSocketIdByUserId(userToChatWith);
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage", newMessage)
    }



    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getUsersForSideBar, getMessages, sendMessages };
