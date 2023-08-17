import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

//@desc      Get all Messages from a specific chat
//@route     GET /api/messages/:chatId
//@access    Private
const allChatMessages = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "All Chat Messages" });
});

//@desc      Create New Message
//@route     POST /api/messages/
//@access    Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Message content cannot be empty");
  }

  if (!chatId) {
    res.status(400);
    throw new Error("Chat Id must be provided");
  }

  const newMsg = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMsg);

    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });
    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { allChatMessages, sendMessage };
