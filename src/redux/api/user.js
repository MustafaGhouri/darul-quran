import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/user`,
        credentials: "include",
    }),
    tagTypes: ["userApi", "userDetails", "userEnrollments", "userInvoices"],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ page, limit, search, status, role }) => ({
                url: "/getAllUsers",
                method: "GET",
                params: { page, limit, search, status, role }
            }),
            providesTags: ["user"],
        }),
        getAllTeachers: builder.query({
            query: ({ page, limit, search }) => ({
                url: "/getTeachers",
                method: "GET",
                params: { page, limit, search }
            }),
            providesTags: ["user"],
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: `/userByID/${id}`,
                method: "GET",
            }),
            providesTags: ["user"],
        }),
        createOrUpdateUser: builder.mutation({
            query: (data) => ({
                url: `/create-user`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/deleteUser/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"],
        }),
        bulkDeleteUser: builder.mutation({
            query: (ids) => ({
                url: `/bulkDelete`,
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: { ids },
            }),
            invalidatesTags: ["user"],
        }),
        syncUserWithZoom: builder.mutation({
            query: (id) => ({
                url: `/sync-zoom-user/${id}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, arg) =>
                error ? [] : ['user']
        }),
        getAllUserForSelect: builder.query({
            query: ({ page, limit, search, courseId }) => ({
                url: "/getAllUserForSelect",
                method: "GET",
                params: {
                    page, limit, search, courseId
                },
            }),
            providesTags: ["user"],
        }),
        // User details page endpoints
        getUserDetails: builder.query({
            query: (id) => ({
                url: `/details/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "userDetails", id }],
        }),
        getUserEnrollments: builder.query({
            query: ({ id, page, limit, search }) => ({
                url: `/enrollments/${id}`,
                method: "GET",
                params: { page, limit, search }
            }),
            providesTags: (result, error, { id }) => [{ type: "userEnrollments", id }],
        }),
        getUserInvoices: builder.query({
            query: ({ id, page, limit, status }) => ({
                url: `/invoices/${id}`,
                method: "GET",
                params: { page, limit, status }
            }),
            providesTags: (result, error, { id }) => [{ type: "userInvoices", id }],
        }),
        getEnrollmentDetails: builder.query({
            query: ({ id, enrollmentId }) => ({
                url: `/enrollments/${id}/details/${enrollmentId}`,
                method: "GET",
            }),
            providesTags: (result, error, { id }) => [{ type: "userEnrollments", id }],
        }),
        exportInvoicesToCsv: builder.mutation({
            query: (id) => ({
                url: `/invoices/${id}/export`,
                method: "GET",
                responseHandler: (response) => response.text(),
            }),
        }),
    })
})

export const {
    useGetAllUsersQuery,
    useGetAllTeachersQuery,
    useGetUserByIdQuery,
    useCreateOrUpdateUserMutation,
    useDeleteUserMutation,
    useBulkDeleteUserMutation,
    useSyncUserWithZoomMutation,
    useGetAllUserForSelectQuery,
    useGetUserDetailsQuery,
    useGetUserEnrollmentsQuery,
    useGetUserInvoicesQuery,
    useGetEnrollmentDetailsQuery,
    useExportInvoicesToCsvMutation,
} = userAPI;