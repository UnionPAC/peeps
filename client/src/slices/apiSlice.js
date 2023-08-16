import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "" }), // empty b/c using a proxy
  endpoints: (builder) => ({}),
  tagTypes: ["User"],
});

export default apiSlice;
