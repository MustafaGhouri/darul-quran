import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApi = createApi({
    reducerPath: "analyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/analytics`,
        credentials: "include",
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
    }),
});

export const {
    useGetAnalyticsQuery,
} = analyticsApi;
