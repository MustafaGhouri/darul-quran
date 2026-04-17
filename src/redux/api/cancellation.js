import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cancellationApi = createApi({
  reducerPath: "cancellationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/cancellation`,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
    fetchFn: (url, options) => fetch(url, { ...options, credentials: "include" }),
  }),
  tagTypes: ["Cancellation"],
  endpoints: (builder) => ({
    createCancellationRequest: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cancellation"],
    }),
    getAllCancellationRequests: builder.query({
      query: (params) => ({
        url: "/getAll",
        params,
      }),
      providesTags: ["Cancellation"],
    }),
    updateCancellationRequestStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/update-status/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cancellation"],
    }),
  }),
});

export const {
  useCreateCancellationRequestMutation,
  useGetAllCancellationRequestsQuery,
  useUpdateCancellationRequestStatusMutation,
} = cancellationApi;
