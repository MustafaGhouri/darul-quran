import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactFormsApi = createApi({
  reducerPath: "contactFormsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/contact`,
    credentials: "include",
  }),
  tagTypes: ["contactForms"],
  endpoints: (builder) => ({
    getContactSubmissions: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/submissions",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["contactForms"],
    }),
  }),
});

export const { useGetContactSubmissionsQuery } = contactFormsApi;
