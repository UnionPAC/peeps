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
      query: (data) => ({
        url: `${CHATS_URL}/group`,
        method: "POST",
        body: data,
      }),
    }),
    renameGroupChat: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}/rename`,
        method: "PUT",
        body: data,
      }),
    }),
    removeFromGroup: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}/groupremove`,
        method: "PUT",
        body: data,
      }),
    }),
    addToGroup: builder.mutation({
      query: () => ({
        url: `${CHATS_URL}/groupadd`,
        method: "PUT",
      }),
    }),
    deleteChat: builder.mutation({
      query: (data) => ({
        url: `${CHATS_URL}`,
        method: "DELETE",
        body: data,
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
