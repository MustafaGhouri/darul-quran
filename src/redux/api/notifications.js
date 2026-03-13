import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/notifications",
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
            query: ({ search, is_read, type, is_pop_over, limit, page }) => ({
                url: "/list",
                method: "GET",
                params: { search, is_read, type, is_pop_over, limit, page }
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Notification', id })),
                        { type: 'Notification', id: 'LIST' },
                    ]
                    : [{ type: 'Notification', id: 'LIST' }],
            transformResponse: (response) => ({
                data: response.data || [],
                pagination: response.pagination || { totalPages: 1, limit: 20, offset: 0, count: 0 }
            }),
        }),

        // Mark notification as read
        markAsRead: builder.mutation({
            query: (data) => ({
                url: "/mark-read",
                method: "POST",
                body: data,
            }),
            async onQueryStarted({ id, is_read }, { dispatch, queryFulfilled, getState }) {
                if (!id) return;

                const state = getState();
                const queries = state.notificationApi?.queries || {};

                // Update all cached getNotifications queries that contain this notification
                const patches = [];
                Object.entries(queries).forEach(([key, queryState]) => {
                    if (queryState?.endpointName !== 'getNotifications' || !queryState?.originalArgs) return;
                    
                    const arg = queryState.originalArgs;
                    const patchResult = dispatch(
                        notificationApi.util.updateQueryData('getNotifications', arg, (draft) => {
                            const notification = draft.data?.find((n) => n.id === id);
                            if (notification) {
                                notification.is_read = true;
                            }
                            // Also remove from list if filtering by unread
                            if (arg.is_read === 'false') {
                                draft.data = draft.data.filter((n) => n.id !== id);
                            }
                        })
                    );
                    patches.push(patchResult);
                });

                try {
                    await queryFulfilled;
                } catch {
                    patches.forEach((patch) => patch.undo());
                }
            },
        }),

        // Delete read notifications
        deleteReadNotifications: builder.mutation({
            query: () => ({
                url: "/delete-read",
                method: "DELETE",
            }),
            invalidatesTags: ['Notification'],
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
    useDeleteReadNotificationsMutation,
} = notificationApi;
