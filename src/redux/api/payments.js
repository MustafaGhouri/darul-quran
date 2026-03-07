import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/payment`,
        credentials: "include",
    }),
    tagTypes: ["Payment", "Refund"],
    endpoints: (builder) => ({
        // Get payment history (unified invoices with pagination)
        getPaymentHistory: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: "/history",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["Payment"],
        }),

        // Get student's refund requests with pagination and search
        getMyRefundRequests: builder.query({
            query: ({ page = 1, limit = 10, search = '' } = {}) => ({
                url: "/refund-requests",
                method: "GET",
                params: { page, limit, search }
            }),
            providesTags: ["Refund"],
        }),

        // Get subscription invoices
        getSubscriptionInvoices: builder.query({
            query: () => ({
                url: "/subscriptions/invoices",
                method: "GET",
            }),
            providesTags: ["Payment"],
        }),

        // Request refund for an invoice (student)
        requestRefund: builder.mutation({
            query: (data) => ({
                url: "/refund-request",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
            invalidatesTags: ["Refund"],
        }),

        // Process refund action (admin - approve/reject)
        processRefundAction: builder.mutation({
            query: (data) => ({
                url: "/admin/refund-action",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
            invalidatesTags: ["Refund"],
        }),

        // Admin: Get all refund requests
        getAdminRefundRequests: builder.query({
            query: ({ page = 1, limit = 20, search = '', status = 'all' } = {}) => ({
                url: "/admin/refunds",
                method: "GET",
                params: { page, limit, search, status }
            }),
            providesTags: ["Refund"],
        }),

        // Admin: Get all payment history
        getAdminPaymentHistory: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: "/admin/history",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["Payment"],
        }),
        
        // Student: Get my subscriptions
        getMySubscriptions: builder.query({
            query: (params) => ({
                url: `/subscriptions${params?.search ? `?search=${params.search}` : ""}`,
                method: "GET",
            }),
            providesTags: ["Payment"],
        }),

        // Student: Cancel subscription
        cancelSubscription: builder.mutation({
            query: (data) => ({
                url: "/subscriptions/cancel",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            }),
            invalidatesTags: ["Payment"],
        }),
    })
});

export const {
    useGetPaymentHistoryQuery,
    useGetMyRefundRequestsQuery,
    useGetSubscriptionInvoicesQuery,
    useGetMySubscriptionsQuery,
    useRequestRefundMutation,
    useProcessRefundActionMutation,
    useGetAdminRefundRequestsQuery,
    useGetAdminPaymentHistoryQuery,
    useCancelSubscriptionMutation
} = paymentApi;
