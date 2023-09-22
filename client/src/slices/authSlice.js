import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  // get userInfo if it already exists
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  selectedChat: localStorage.getItem("selectedChat")
    ? JSON.parse(localStorage.getItem("selectedChat"))
    : null,
  socket: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      localStorage.setItem("selectedChat", JSON.stringify(action.payload));
    },
    clearSelectedChat: (state) => {
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
