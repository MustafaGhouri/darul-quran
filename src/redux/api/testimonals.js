import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const testimonalAPI = createApi({
  reducerPath: "testimonalAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/testimonals`,
    credentials: "include",
  }),
  tagTypes: ["testimonal"],
  endpoints: (builder) => ({
    createTestimonal: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["testimonal"],
    }),
    getAllTestimonals: builder.query({
      query: () => ({
        url: "/get",
        method: "GET",
      }),
      providesTags: ["testimonal"],
    }),
    updateTestimonal: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["testimonal"],
    }),
    deleteTestimonal: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["testimonal"],
    }),
  }),
});

export const {
  useCreateTestimonalMutation,
  useGetAllTestimonalsQuery,
  useUpdateTestimonalMutation,
  useDeleteTestimonalMutation,
} = testimonalAPI;
