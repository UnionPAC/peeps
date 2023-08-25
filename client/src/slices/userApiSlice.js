import apiSlice from "./apiSlice";

const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => {
        const { name, email, profilePic } = data;
        console.log("Data being sent to updateUserProfile mutation:", {
          name,
          email,
          profilePic,
        });
        const formData = new FormData();

        if (name) {
          formData.append("name", name);
        }

        if (email) {
          formData.append("email", email);
        }

        if (profilePic) {
          formData.append("profilePic", profilePic);
        }

        // return stuff ...
        return {
          url: `${USERS_URL}/profile`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    deleteUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} = userApiSlice;
