import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

/* CONSTANTS */
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

server.listen(PORT, () => {
  console.log(`server listening on port:${PORT}`);
});

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

/* Socket.io */

io.on("connection", (socket) => {
  console.log(socket.id);
});
















/* 
// User setup
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
    console.log(`${user.username} connected to socket.io`);
  });

  // Joining a chat room
  socket.on("join chat", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);
  });

  // Typing indication
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // New message
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // New chat
  socket.on("new chat", ({ chat, chatCreatorId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == chatCreatorId) return;
      socket.in(user._id).emit("chat created");
    });
  });

  // Rename group
  socket.on("rename group", ({ chat, renamerId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == renamerId) return;
      socket.in(user._id).emit("group renamed");
    });
  });

  // Add user to group
  socket.on("add user", ({ chat, addedUserId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == addedUserId) {
        socket.in(user._id).emit("user added");
      }
    });
  });

  // Remove user from group
  socket.on("remove user", ({ chat, removedUserId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == removedUserId) {
        socket.in(user._id).emit("user removed");
      }
    });
  });

  // Delete group
  socket.on("delete group", ({ chat, deleterId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == deleterId) return;
      socket.in(user._id).emit("group deleted");
    });
  });
*/
