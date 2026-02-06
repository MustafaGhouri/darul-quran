import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/course",
        credentials: "include",
    }),
    tagTypes: ["course"],
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => "/getAllCourses",
            providesTags: ["course"],
        }),
        getCourseById: builder.query({
            query: (id) => `/getCourseById/${id}`,
        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: "/createCourse",
                method: "POST",
                body: data,
            }),
        }),
        updateCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `/updateCourse/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["course"],
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/deleteCourse`,
                method: "DELETE",
                credentials: "include",
                body: { id },
            }),
            invalidatesTags: ["course"],
        }),
        getAllCategories: builder.query({
            query: () => "/getAllCategories",
            providesTags: ["categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/deleteCategory`,
                method: "DELETE",
                body: { category_id: id },
            }),
            invalidatesTags: ["categories"],
        }),
        addCategory: builder.mutation({
            query: (category_name) => ({
                url: "/addCategory",
                method: "POST",
                body: { category_name: category_name },
            }),
            invalidatesTags: ["categories"],
        }),
    }),
});


export const {
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetAllCategoriesQuery,
    useDeleteCategoryMutation,
    useAddCategoryMutation,
} = courseApi;