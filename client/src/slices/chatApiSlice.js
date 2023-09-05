import apiSlice from "./apiSlice";

const CHATS_URL = "/api/chats";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    accessChat: builder.mutation({
      query: (id) => ({
        url: `${CHATS_URL}`,
        method: "POST",
        body: { id },
      }),
    }),
    // fetchChats
    fetchChats: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "GET",
      }),
    }),
    // createGroupChat
    // renameGroupChat
    // removeFromGroup
    // addToGroup
    // deleteChat
  }),
});

export const { useAccessChatMutation, useFetchChatsMutation } = chatApiSlice;
