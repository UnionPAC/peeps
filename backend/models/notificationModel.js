import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipients: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
