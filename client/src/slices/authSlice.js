import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get userInfo if it already exists
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  selectedChat: null,
  notifications: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearCredentials: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      localStorage.setItem("selectedChat", JSON.stringify(action.payload));
    },
    clearSelectedChat: (state, action) => {
      state.selectedChat = null;
      localStorage.removeItem("selectedChat");
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setSelectedChat,
  clearSelectedChat,
} = authSlice.actions;

export default authSlice.reducer;
