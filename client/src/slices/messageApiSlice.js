import apiSlice from "./apiSlice";

const MESSAGES_URL = "/api/messages";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGES_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useFetchMessagesMutation, useSendMessageMutation } =
  messageApiSlice;
