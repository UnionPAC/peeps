import express from "express";
import {
  createNotification,
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, fetchNotifications)
  .post(protect, createNotification);
router.route("/:notificationId").delete(protect, deleteNotification);
router
  .route("/:notificationId/mark-as-read")
  .put(protect, markNotificationAsRead);

export default router;
