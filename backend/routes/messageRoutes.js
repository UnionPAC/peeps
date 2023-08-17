import express from "express";
import { allChatMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allChatMessages);

export default router;
