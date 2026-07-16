import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationPreferencesApi = createApi({
  reducerPath: "notificationPreferencesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/notification-preferences`,
    credentials: "include",
    //only need this if dommian is not same as backend for sfari & incoginito browser
    // prepareHeaders: (headers, { getState }) => {
    //     const tokenFromState = getState().user?.token;

    //     const finalToken = tokenFromState || localStorage.getItem("token");

    //     if (finalToken) {
    //         headers.set("Authorization", `Bearer ${finalToken}`);
    //     }

    //     return headers;
    // },
  }),
  tagTypes: ["NotificationPreference"],
  endpoints: (builder) => ({
    getNotificationPreference: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["NotificationPreference"],
    }),
    updateNotificationPreference: builder.mutation({
      query: ({ emailEnabled }) => ({
        url: "/",
        method: "PATCH",
        body: { emailEnabled },
      }),
      invalidatesTags: ["NotificationPreference"],
    }),
  }),
});

export const {
  useGetNotificationPreferenceQuery,
  useUpdateNotificationPreferenceMutation,
} = notificationPreferencesApi;
