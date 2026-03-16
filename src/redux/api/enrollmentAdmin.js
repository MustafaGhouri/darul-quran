import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enrollmentAdminApi = createApi({
    reducerPath: "enrollmentAdminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/enrollment-admin`,
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
    tagTypes: ["enrollment"],
    endpoints: (builder) => ({
        getTopPerformingStudents: builder.query({
            query: ({ page, limit, search, courseId, sortBy }) => ({
                url: "/top-students",
                params: { page, limit, search, courseId, sortBy },
            }),
            providesTags: ["enrollment"],
        }),
        getCourseProgressAnalytics: builder.query({
            query: ({ page, limit, search, sort }) => ({
                url: "/course-analytics",
                params: { page, limit, search, sort },
            }),
            providesTags: ["enrollment"],
        }),
        getStudentCourseProgress: builder.query({
            query: ({ courseId, page, limit, search }) => ({
                url: `/courses/${courseId}/progress`,
                params: { page, limit, search },
            }),
            providesTags: ["enrollment"],
        }),
        getEnrollmentStats: builder.query({
            query: ({ courseId }) => ({
                url: "/stats",
                params: { courseId },
            }),
            providesTags: ["enrollment"],
        }),
        getEnrollments: builder.query({
            query: (params) => ({
                url: "/enrollments",
                params,
            }),
            providesTags: ["enrollment"],
        }),
    }),
});

export const {
    useGetTopPerformingStudentsQuery,
    useGetCourseProgressAnalyticsQuery,
    useGetStudentCourseProgressQuery,
    useGetEnrollmentStatsQuery,
    useGetEnrollmentsQuery,
} = enrollmentAdminApi;
