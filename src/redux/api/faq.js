import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const faqAPI = createApi({
  reducerPath: "faqAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/faqs`,
    credentials: "include",
    //only need this if dommian is not same as backend for sfari & incoginito browser
        // prepareHeaders: (headers, { getState }) => {
        //     const tokenFromState = getState().user?.token;

        //     const finalToken = tokenFromState || localStorage.getItem("token");

        //     if (finalToken) {
        //         headers.set("Authorization", `Bearer ${finalToken}`);
        //     }

        //     return headers;
        // },
  }),
  tagTypes: ["faq"],
  endpoints: (builder) => ({
    createFaq: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),
    getAllFaqs: builder.query({
      query: (params) => ({
        url: "/get",
        method: "GET",
        params,
      }),
      providesTags: ["faq"],
    }),
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),
  }),
});

export const {
  useCreateFaqMutation,
  useGetAllFaqsQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqAPI;
