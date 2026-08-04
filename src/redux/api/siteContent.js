import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const siteContentAPI = createApi({
  reducerPath: "siteContentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/site-content`,
    credentials: "include",
  }),
  tagTypes: ["siteContent"],
  endpoints: (builder) => ({
    getSiteContent: builder.query({
      query: () => ({
        url: "/get",
        method: "GET",
      }),
      providesTags: ["siteContent"],
    }),
    updateSiteContent: builder.mutation({
      query: (data) => ({
        url: "/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["siteContent"],
    }),
  }),
});

export const {
  useGetSiteContentQuery,
  useUpdateSiteContentMutation,
} = siteContentAPI;
