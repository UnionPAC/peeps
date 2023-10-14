import express from "express";
import path from "path";
import { createServer } from "http";
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
import chalk from "chalk";

const app = express();
const server = createServer(app);

// Connect to MongoDB
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// --------------------------deployment------------------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

/* Socket.io */

const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  // User setup
  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log(chalk.blue(`${user.username} connected`));
    socket.emit("connected");
  });

  // Joining a chat room
  socket.on("join chat", ({ username, room }) => {
    socket.join(room);
    if (room) {
      console.log(chalk.yellow(`${username} joined room ${room}`));
    } else {
      console.log(chalk.red(`${username} joined room ${room}`));
    }
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
      socket.in(user._id).emit("group renamed", chat);
    });
  });

  // Add user to group
  socket.on("add user", ({ chat, addedUserId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == addedUserId) {
        socket.in(user._id).emit("user added", chat);
      }
    });
  });

  // Remove user from group
  socket.on("remove user", ({ chat, removedUserId }) => {
    socket.in(removedUserId).emit("user removed", chat);
  });

  // User leaves group
  socket.on("leave group", ({ chat, leavingId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    console.log(chat, leavingId);

    chat.users.forEach((user) => {
      if (user._id == leavingId) return;
      socket.in(user._id).emit("left group", chat);
      console.log(`emitting event to ${user.username}`);
    });
  });

  // Delete group
  socket.on("delete group", ({ chat, deleterId }) => {
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == deleterId) return;
      socket.in(user._id).emit("group deleted", chat);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
