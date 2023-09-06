import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";
import { unlinkSync, writeFileSync } from "fs";

// @desc    Search all users
// @route   GET /api/users?search=
// @access  Public
const allUsers = asyncHandler(async (req, res) => {
  // console.log(req.query.search);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });

  res.send(users);
});

// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name || null,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || null,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name || null,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || null,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Successfully logged out!" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name || null,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || null,
    });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.file) {
      // upload file to cloudinary
      try {
        // create temporary file path for the profilePic (comes in as type Buffer)
        const tempFilePath = "./temp_upload";

        writeFileSync(tempFilePath, req.file.buffer);

        const result = await cloudinary.uploader.upload(tempFilePath, {
          public_id: `profile_pictures/${req.file.originalname}`,
        });

        // console.log(
        //   `Successfully uploaded to Cloudinary: ${JSON.stringify(result)}`
        // );

        const imageUrl = result.url;
        user.profilePic = imageUrl;
        unlinkSync(tempFilePath);
      } catch (error) {
        console.log(`Error uploading file to cloudinary: ${error}`);
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await User.deleteOne(user);
    res.status(200).json({ message: "Successfully deleted account!" });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

export {
  allUsers,
  registerUser,
  authUser,
  logout,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
