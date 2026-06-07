import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rescheduleApi = createApi({
    reducerPath: "rescheduleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/reschedule`,
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
    tagTypes: ["rescheduleRequests"],
    endpoints: (builder) => ({
        // Create a reschedule request (Student)
        createRescheduleRequest: builder.mutation({
            query: (data) => ({
                url: "/request",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
            invalidatesTags: ["rescheduleRequests"],
        }),

        // Get all reschedule requests (Admin gets all, Student gets own)
        getRescheduleRequests: builder.query({
            query: ({ status = "all", page = "1", limit = "10", scheduleId } = {}) => ({
                url: "/requests",
                params: { status, page, limit, scheduleId },
            }),
            providesTags: ["rescheduleRequests"],
        }),

        // Get single reschedule request by ID
        getRescheduleRequestById: builder.query({
            query: (id) => ({
                url: `/request/${id}`,
            }),
            providesTags: ["rescheduleRequests"],
        }),

        // Approve reschedule request (Admin)
        approveRescheduleRequest: builder.mutation({
            query: ({ id, adminResponse }) => ({
                url: `/request/${id}/approve`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: { adminResponse },
            }),
            invalidatesTags: ["rescheduleRequests"],
        }),

        // Reject reschedule request (Admin)
        rejectRescheduleRequest: builder.mutation({
            query: ({ id, adminResponse }) => ({
                url: `/request/${id}/reject`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: { adminResponse },
            }),
            invalidatesTags: ["rescheduleRequests"],
        }),

        // Cancel reschedule request (Student)
        cancelRescheduleRequest: builder.mutation({
            query: (id) => ({
                url: `/request/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["rescheduleRequests"],
        }),
    }),
});

export const {
    useCreateRescheduleRequestMutation,
    useGetRescheduleRequestsQuery,
    useGetRescheduleRequestByIdQuery,
    useApproveRescheduleRequestMutation,
    useRejectRescheduleRequestMutation,
    useCancelRescheduleRequestMutation,
} = rescheduleApi;
