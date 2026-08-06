import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const seoSettingsAPI = createApi({
  reducerPath: "seoSettingsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/seo-settings`,
    credentials: "include",
  }),
  tagTypes: ["seoSettings"],
  endpoints: (builder) => ({
    getSeoSettings: builder.query({
      query: () => ({
        url: "/get",
        method: "GET",
      }),
      providesTags: ["seoSettings"],
    }),
    updateSeoSettings: builder.mutation({
      query: (data) => ({
        url: "/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["seoSettings"],
    }),
  }),
});

export const {
  useGetSeoSettingsQuery,
  useUpdateSeoSettingsMutation,
} = seoSettingsAPI;
