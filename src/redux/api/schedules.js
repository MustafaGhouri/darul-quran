import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scheduleApi = createApi({
    reducerPath: "scheduleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const tokenFromState = getState().user?.token;

            const finalToken = tokenFromState || localStorage.getItem("token");

            if (finalToken) {
                headers.set("Authorization", `Bearer ${finalToken}`);
            }

            return headers;
        },
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
        getSchedulesByMonth: builder.query({
            query: (month) => ({
                url: "/getByMonth",
                params: { month },
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
            invalidatesTags: (result, error, arg) =>
                error ? [] : ['schedule']
        }),
        updateSchedule: builder.mutation({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                headers: { "Content-Type": "application/json" },
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, arg) =>
                error ? [] : ['schedule']
        }),
        deleteSchedule: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) =>
                error ? [] : ['schedule']
        }),
        addScheduleNote: builder.mutation({
            query: ({ id, note, date }) => ({
                url: `/add-note/${id}`,
                method: "POST",
                body: { note, date },
            }),
            invalidatesTags: (result, error, arg) =>
                error ? [] : ['schedule']
        }),
    }),
});

export const {
    useGetScheduleQuery,
    useGetSchedulesByMonthQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
    useAddScheduleNoteMutation,
} = scheduleApi;
