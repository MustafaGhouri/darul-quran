import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const siteSettingsAPI = createApi({
  reducerPath: "siteSettingsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/site-settings`,
    credentials: "include",
  }),
  tagTypes: ["siteSettings"],
  endpoints: (builder) => ({
    getSiteSettings: builder.query({
      query: () => ({
        url: "/get",
        method: "GET",
      }),
      providesTags: ["siteSettings"],
    }),
    updateSiteSettings: builder.mutation({
      query: (data) => ({
        url: "/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["siteSettings"],
    }),
  }),
});

export const {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} = siteSettingsAPI;
