import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

connectDb();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    // Adds the socket to the given room or to the list of rooms.
    socket.join(user._id);
    socket.emit("connected");
    console.log(`${user.username} is online`)
  });

  socket.on("chat join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    // console.log(newMessageReceived);
    const chat = newMessageReceived.chat;
    console.log(chat);

    // validation: check for users in chat
    if (!chat.users) {
      console.log("chat.users is not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off('setup', () => {
    console.log('User Disconnected')
    socket.leave(user._id)
  })
});
