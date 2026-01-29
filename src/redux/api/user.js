import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/user`,
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
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/deleteUser/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"],
        })
    })
})

export const {
    useGetAllUsersQuery,
    useDeleteUserMutation
} = userAPI;