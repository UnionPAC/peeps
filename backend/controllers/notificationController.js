import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

//@desc      Create a new notification
//@route     POST /api/notifications
//@access    Private
const createNotification = asyncHandler(async (req, res) => {
  const { message, recipients, chat } = req.body;

  console.log({message, recipients, chat})

  if (!message || !recipients || !chat) {
    res.status(400);
    throw new Error("Invalid data for create notification request");
  }

  if (!req.user._id) {
    res.status(400);
    throw new Error("Unauthorized, no valid user found");
  }

  const newNotification = {
    message,
    sender: req.user._id,
    recipients,
    chat,
  };

  try {
    let notification = await Notification.create(newNotification);
    res.status(200).json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc      Fetch all notifications
//@route     GET /api/notifications
//@access    Private
const fetchNotifications = asyncHandler(async (req, res) => {
  // get all notifications for a particular user
  const userId = req.user._id;

  if (!userId) {
    res.status(400);
    throw new Error("Not authorized, Unrecognized user");
  }

  try {
    let notifications = await Notification.find({ recipients: userId }).populate('sender').populate('chat');
    notifications = await User.populate(notifications, {
      path: "chat.users",
      select: "username profilePic email",
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error("Unable to fetch notifications");
  }
});


//@desc      Delete a notification
//@route     DELETE /api/notifications/:id
//@access    Private
const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    res.status(400);
    throw new Error(
      "Could not find the notification ID you are wanting to access"
    );
  }

  const notificationToDelete = await Notification.findById(notificationId);

  if (!notificationToDelete) {
    res.status(404);
    throw new Error("Notification not found");
  }

  try {
    notificationToDelete.deleteOne();
    res.status(200).json({ message: "Successfully deleted notification" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export {
  createNotification,
  fetchNotifications,
  deleteNotification,
};
