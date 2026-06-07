import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/dashboard`,
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
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        getAdminDashboard: builder.query({
            query: () => "/admin",
            providesTags: ["Dashboard"],
        }),
        getStudentDashboard: builder.query({
            query: () => "/student",
            providesTags: ["Dashboard"],
        }),
        getTeacherDashboard: builder.query({
            query: () => "/teacher",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetAdminDashboardQuery,
    useGetStudentDashboardQuery,
    useGetTeacherDashboardQuery,
} = dashboardApi;
