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
    fetchChats: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "GET",
      }),
    }),
    createGroupChat: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "POST",
      }),
    }),
    renameGroupChat: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "POST",
      }),
    }),
    removeFromGroup: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "POST",
      }),
    }),
    addToGroup: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "POST",
      }),
    }),
    deleteChat: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAccessChatMutation,
  useFetchChatsMutation,
  useCreateGroupChatMutation,
  useRenameGroupChatMutation,
  useRemoveFromGroupMutation,
  useAddToGroupMutation,
  useDeleteChatMutation,
} = chatApiSlice;
