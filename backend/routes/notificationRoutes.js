import express from "express";
import {
  createNotification,
  fetchNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, fetchNotifications)
  .post(protect, createNotification);
router.route("/:notificationId").delete(protect, deleteNotification);

export default router;
