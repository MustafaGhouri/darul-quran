import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/user`,
        credentials: "include",
    }),
    tagTypes: ["userApi"],
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
            invalidatesTags: ["user"],
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
} = userAPI;