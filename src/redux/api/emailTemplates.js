import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SYSTEM_TEMPLATE_VARIABLES = [
  "{{class_title}}",
  "{{form_title}}",
  "{{course_name}}",
  "{{teacher_name}}",
];

export function slugifyFormLabel(label) {
  if (!label) return "";
  return String(label)
    .toLowerCase()
    .trim()
    .replace(/\s*\(responses\)\s*/gi, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function buildPreviewMapFromVariables(variables = []) {
  const map = {
    class_title: "Ijazah Ghaibi",
    form_title: "Ijazah Ghaibi",
    course_name: "Ijazah Ghaibi",
    teacher_name: "Ustadha Fatima",
  };

  (variables || []).forEach((item) => {
    const slug = item.slug || slugifyFormLabel(item.label);
    if (slug) map[slug] = item.sampleValue ?? "";
  });

  return map;
}

export const renderEmailTemplatePreview = (text, variables = []) => {
  if (!text) return "";
  const merged = buildPreviewMapFromVariables(variables);
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = merged[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
};

export const emailTemplateApi = createApi({
  reducerPath: "emailTemplateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/email-templates`,
    credentials: "include",
  }),
  tagTypes: ["emailTemplates"],
  endpoints: (builder) => ({
    getEmailTemplates: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["emailTemplates"],
    }),
    getEmailTemplateById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["emailTemplates"],
    }),
    createEmailTemplate: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["emailTemplates"],
    }),
    updateEmailTemplate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["emailTemplates"],
    }),
    deleteEmailTemplate: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["emailTemplates"],
    }),
    previewEmailTemplate: builder.mutation({
      query: (data) => ({
        url: "/preview",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  usePreviewEmailTemplateMutation,
} = emailTemplateApi;
