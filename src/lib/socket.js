const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online with socket ID ${socket.id}`);
  });

  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      // Emit the message to the receiver
      // Change this to newMessage to match the controller
      io.to(receiverSocketId).emit("newMessage", message);
      console.log(`Message sent to ${receiverId}: ${message.text}`);
    } else {
      console.log("User is not online");
    }
  });

  socket.on("disconnect", () => {
    // Find and remove the disconnected user from onlineUsers
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log("A user disconnected", socket.id);
  });
});

function getSocketIdByUserId(userId) {
  return onlineUsers.get(userId);
}

module.exports = { io, app, server, getSocketIdByUserId };
