import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: localStorage.getItem("selectedChat"),
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
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

export const { setSelectedChat } = chatSlice.actions;

export default chatSlice.reducer;
