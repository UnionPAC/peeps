import asyncHandler from "express-async-handler";

// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  res.send("register user");
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  res.send("auth user");
});

// @desc    Logout user & clear token
// @route   POST /api/users/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  res.send("logout");
});

// @desc    Search all users
// @route   GET /api/users?search=
// @access  Public
const allUsers = asyncHandler(async (req, res) => {
  res.send("search all users");
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send("get user profile");
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("update user profile");
});

export {
  registerUser,
  authUser,
  logout,
  allUsers,
  getUserProfile,
  updateUserProfile,
};
