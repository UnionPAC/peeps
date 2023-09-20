import apiSlice from "./apiSlice";

const NOTICATIONS_URL = "/api/notifications";

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNotification: builder.mutation({
      query: (data) => ({
        url: `${NOTICATIONS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    fetchNotifications: builder.query({
      query: () => ({
        url: `${NOTICATIONS_URL}`,
        method: "GET",
      }),
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTICATIONS_URL}/${notificationId}/mark-as-read`,
        method: "PUT",
      }),
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTICATIONS_URL}/${notificationId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApiSlice;
