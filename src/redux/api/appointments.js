import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/appointments`,
    credentials: "include",
  }),
  tagTypes: ["appointmentSlots", "appointmentRequests", "publicAppointmentSlots"],
  endpoints: (builder) => ({
    getPublicAppointmentSlots: builder.query({
      query: () => ({ url: "/public/slots", method: "GET" }),
      providesTags: ["publicAppointmentSlots"],
    }),
    submitAppointmentRequest: builder.mutation({
      query: (body) => ({ url: "/request", method: "POST", body }),
      invalidatesTags: ["publicAppointmentSlots"],
    }),
    getAppointmentSlots: builder.query({
      query: () => ({ url: "/slots", method: "GET" }),
      providesTags: ["appointmentSlots"],
    }),
    addAppointmentSlot: builder.mutation({
      query: (body) => ({ url: "/slots", method: "POST", body }),
      invalidatesTags: ["appointmentSlots"],
    }),
    deleteAppointmentSlot: builder.mutation({
      query: (id) => ({ url: `/slots/${id}`, method: "DELETE" }),
      invalidatesTags: ["appointmentSlots"],
    }),
    getAppointmentRequests: builder.query({
      query: () => ({ url: "/requests", method: "GET" }),
      providesTags: ["appointmentRequests"],
    }),
    updateAppointmentRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/requests/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["appointmentRequests"],
    }),
  }),
});

export const {
  useGetPublicAppointmentSlotsQuery,
  useSubmitAppointmentRequestMutation,
  useGetAppointmentSlotsQuery,
  useAddAppointmentSlotMutation,
  useDeleteAppointmentSlotMutation,
  useGetAppointmentRequestsQuery,
  useUpdateAppointmentRequestStatusMutation,
} = appointmentsApi;
