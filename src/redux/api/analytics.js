import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApi = createApi({
    reducerPath: "analyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/analytics`,
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
    tagTypes: ["Analytics"],
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: (params) => ({
                url: "/analytics",
                params,
            }),
            providesTags: ["Analytics"],
        }),
        getActivities: builder.query({
            query: (params) => ({
                url: "/activities",
                params,
            }),
            providesTags: ["Analytics"],
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
    useGetActivitiesQuery,
} = analyticsApi;
