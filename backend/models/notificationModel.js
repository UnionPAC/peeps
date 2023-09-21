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
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
