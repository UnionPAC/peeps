import asyncHandler from "express-async-handler";

// @route   POST /api/users/
// @desc    Register a new user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  
});

// @route   POST /api/users/auth
// @desc    Auth user & get token
// @access  Public

// @route   POST /api/users/logout
// @desc    Auth user & get token
// @access  Public

// @route   GET /api/users/
// @desc    Search all users
// @access  Public

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
