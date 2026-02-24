import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supportTicketApi = createApi({
    reducerPath: "supportTicketApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/support-tickets",
        credentials: "include",
    }),
    tagTypes: ["SupportTicket"],
    endpoints: (builder) => ({
        // Create a ticket (student / teacher)
        createTicket: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SupportTicket"],
        }),

        // Get my own tickets (student / teacher)
        getMyTickets: builder.query({
            query: ({ page = 1, limit = 10 } = {}) =>
                `/mine?page=${page}&limit=${limit}`,
            providesTags: ["SupportTicket"],
        }),

        // Get all tickets (admin)
        getAllTickets: builder.query({
            query: ({ page = 1, limit = 10, status = "all" } = {}) =>
                `/?page=${page}&limit=${limit}&status=${status}`,
            providesTags: ["SupportTicket"],
        }),

        // Get single ticket
        getTicketById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "SupportTicket", id }],
        }),

        // Admin responds / changes status
        respondToTicket: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}/respond`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SupportTicket"],
        }),

        // Delete a ticket
        deleteTicket: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SupportTicket"],
        }),
    }),
});

export const {
    useCreateTicketMutation,
    useGetMyTicketsQuery,
    useGetAllTicketsQuery,
    useGetTicketByIdQuery,
    useRespondToTicketMutation,
    useDeleteTicketMutation,
} = supportTicketApi;
