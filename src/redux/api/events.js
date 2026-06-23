import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventsAPI = createApi({
  reducerPath: "eventsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/events`,
    credentials: "include",
  }),
  tagTypes: ["events"],
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["events"],
    }),
    getAllEvents: builder.query({
      query: () => ({
        url: "/get",
        method: "GET",
      }),
      providesTags: ["events"],
    }),
    getEventById: builder.query({
      query: (id) => ({
        url: `/get/${id}`,
        method: "GET",
      }),
      providesTags: ["events"],
    }),
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["events"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["events"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
} = eventsAPI;
