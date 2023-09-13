import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

//@desc      Get all messages from a specific chat
//@route     GET /api/messages/:chatId
//@access    Private
const allMessages = asyncHandler(async (req, res) => {
  console.log("hi");
  console.log(req.params);
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username, profilePic, email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc      Create New Message
//@route     POST /api/messages/
//@access    Private
const sendMessage = asyncHandler(async (req, res) => {
  // what is required to send a message?
  // chatId, message, messageSender
  const { content, chatId } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Invalid Data: Content required");
  }

  if (!chatId) {
    res.status(400);
    throw new Error("Invalid Data: ChatId required");
  }

  const chat = await Chat.findById(chatId);
  const userInChat = chat.users.includes(req.user._id);

  if (!userInChat) {
    res.status(403);
    throw new Error("Cannot send a message to a group you aren't in!");
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
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

export { allMessages, sendMessage };
