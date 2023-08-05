import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
import userRoutes from "./routes/userRoutes.js";

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoutes);

console.log(PORT);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
