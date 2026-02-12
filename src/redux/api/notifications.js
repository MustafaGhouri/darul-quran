import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/notifications",
        credentials: "include",
    }),
    tagTypes: ["Notification", "Subscription"],
    endpoints: (builder) => ({
        // Get VAPID public key
        getVapidPublicKey: builder.query({
            query: () => "/vapid-public-key",
        }),

        // Subscribe to push notifications
        subscribe: builder.mutation({
            query: (data) => ({
                url: "/subscribe",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),

        // Unsubscribe from push notifications
        unsubscribe: builder.mutation({
            query: (data) => ({
                url: "/unsubscribe",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),

        // Get user's subscriptions
        getSubscriptions: builder.query({
            query: () => "/subscriptions",
            providesTags: ["Subscription"],
        }),

        // Send test notification
        sendTestNotification: builder.mutation({
            query: () => ({
                url: "/test",
                method: "POST",
            }),
        }),

        // Get user notifications
        getNotifications: builder.query({
            query: () => "/list",
            providesTags: ["Notification"],
        }),

        // Mark notification as read
        markAsRead: builder.mutation({
            query: (data) => ({
                url: "/mark-read",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetVapidPublicKeyQuery,
    useSubscribeMutation,
    useUnsubscribeMutation,
    useGetSubscriptionsQuery,
    useSendTestNotificationMutation,
    useGetNotificationsQuery,
    useMarkAsReadMutation,
} = notificationApi;
