import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from 'cors'
import env from 'dotenv'

env.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ENDPOINT,  // Allow requests from this origin
    methods: ["GET", "POST","PUT"],
    credentials: true,
  },
});


let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add",(newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({userId: newUserId,socketId: socket.id});
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users",activeUsers);
  });
    



  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
  

  socket.on("send-message", (data) => {
    const { recieverId } = data;
    console.log("Active Users:", activeUsers);
    console.log("Sending message to receiver:", recieverId);
    const user = activeUsers.find((user) => user.userId === recieverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
 
});



export { app,server };
