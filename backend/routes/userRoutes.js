import express from "express";
import {
  allUsers,
  registerUser,
  authUser,
  logout,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.route("/").get(protect, allUsers).post(registerUser);
router.post("/auth", authUser);
router.post("/logout", logout);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(upload.single("profilePic"), protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

export default router;
