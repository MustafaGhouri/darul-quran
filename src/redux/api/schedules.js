import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scheduleApi = createApi({
    reducerPath: "scheduleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule`,
        credentials: "include",
    }),
    tagTypes: ["schedule"],
    endpoints: (builder) => ({
        getSchedule: builder.query({
            query: ({ search, page, limit, status }) => ({
                url: "/getAll",
                params: { search, page, limit, status },
            }),
            providesTags: ["schedule"],
        }),
        createSchedule: builder.mutation({
            query: (data) => ({
                url: "/create",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
            invalidatesTags: ["schedule"],
        }),
        updateSchedule: builder.mutation({
            query: ({id, data}) => ({
                url: `/update/${id}`,
                headers: { "Content-Type": "application/json" },
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["schedule"],
        }),
         deleteSchedule: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["schedule"],
        }),
    }),
});

export const {
    useGetScheduleQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
} = scheduleApi;
