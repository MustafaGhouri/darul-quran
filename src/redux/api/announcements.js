import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const announcementAPI = createApi({
    reducerPath: "announcementAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/announcement`,
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
    tagTypes: ["announcement"],
    endpoints: (builder) => ({
        createAnnouncement: builder.mutation({
            query: (data) => ({
                url: "/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["announcement"],
        }),
        getAllAnnouncement: builder.query({
            query: ({ page, limit, sendTo, delivery }) => ({
                url: "/get",
                method: "GET",
                params: { page, limit, sendTo, delivery }
            }),
            providesTags: ["announcement"],
        }),
        updateAnnouncement: builder.mutation({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                headers: { "Content-Type": "application/json" },
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["announcement"],
        }),
        deleteAnnouncement: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["announcement"],
        }),
    })
})

export const {
    useCreateAnnouncementMutation,
    useGetAllAnnouncementQuery,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation
} = announcementAPI;