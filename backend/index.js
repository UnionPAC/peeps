import express from "express";
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
import User from "./models/userModel.js";

/* CONSTANTS */
const PORT = process.env.PORT;

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

app.use(notFound);
app.use(errorHandler);

/* Socket.io */

const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log(`user connected with id: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
