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
  console.log('Socket.io connected!')
  socket.on("setup", (user) => {
    // put user in their own room
    socket.join(user._id);
    socket.emit("connected");
    console.log(`${user.username} connected to socket`)
  });

  socket.on("chat join", ({user, room}) => {
    socket.join(room);
    console.log(`${user.username} has joined room: ${room}`);
  });

  socket.on('new message', (newMessage) => {
    // which chat does this message belong to?
    const chat = newMessage.chat

    if (!chat.users) return console.log('chat.users not defined')

    chat.users.forEach((user) => {
      // exclude emitting new message event to the message sender
      if (user._id == newMessage._id) return;

      socket.in(user._id).emit('message received', newMessage)
    })
  })
});
