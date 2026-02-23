import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceApi = createApi({
    reducerPath: "attendanceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/attendance`,
        credentials: "include",
    }),
    tagTypes: ["attendance"],
    endpoints: (builder) => ({
        getCourseAttendanceSummary: builder.query({
            query: ({ page, limit, search, sort, status ,type}) => ({
                url: "/courses",
                params: { page, limit, search, sort, status ,type},
            }),
            providesTags: ["attendance"],
        }),
        getCourseAttendanceDetail: builder.query({
            query: ({ courseId, page, limit }) => ({
                url: `/courses/${courseId}`,
                params: { page, limit },
            }),
            providesTags: ["attendance"],
        }),
        getAttendanceStats: builder.query({
            query: ({ courseId }) => ({
                url: "/stats",
                params: { courseId },
            }),
            providesTags: ["attendance"],
        }),
    }),
});

export const {
    useGetCourseAttendanceSummaryQuery,
    useGetCourseAttendanceDetailQuery,
    useGetAttendanceStatsQuery,
} = attendanceApi;
