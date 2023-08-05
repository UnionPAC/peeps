import express from "express";
import {
  registerUser,
  authUser,
  logout,
  allUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").get(allUsers).post(registerUser);
router.post("/login", authUser);
router.post("/logout", logout);
router.route("/profile").get(getUserProfile).put(updateUserProfile);

export default router;
