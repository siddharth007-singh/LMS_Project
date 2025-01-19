import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const COURSE_API = "http://localhost:8080/api/v1/cource/";

export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courceTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courceTitle, category },
            }),
            tagTypes: ["Refetch_Creator_Course"],
        }),

        getCreatorCource: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
        }),

        editCource: builder.mutation({
            query: ({ formData, courceId }) => ({
                url: `/${courceId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Refetch_Creator_Course"],
        }),

        removeCource:builder.mutation({
            query:(courceId)=>({
                url: `/${courceId}`,
                method: "DELETE",
            }),
        }),

        getPublishedCources: builder.query({
            query:()=>({
                url: "/published-cources",
                method: "GET",
            }), 
        }),

        getCourceById: builder.query({
            query: (courceId) => ({
                url: `/${courceId}`,
                method: "GET",
            }),
            invalidatesTags: ["Refetch_Creator_Course"],
        }),

        createLecture: builder.mutation({
            query: ({ lectureTitle, courceId }) => ({
                url: `/${courceId}/lecture`,
                method: "POST",
                body: { lectureTitle },
            }),
        }),

        getCourceLecture: builder.query({
            query: (courceId) => ({
                url: `/${courceId}/lecture`,
                method: "GET",
            }),
            providesTags: ["Refetch_Lecture"],
        }),

        editLecture: builder.mutation({
            query: ({ lectureTitle, videoInfo, isPreviewFree, courceId, lectureId }) => ({
                url: `/${courceId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree }
            }),
        }),


        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Refetch_Lecture"],
        }),

        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            }),
        }),

        publishUnbulish: builder.mutation({
            query:({courceId, query}) => ({
                url:`/${courceId}/?publish=${query}`,
                method:"PATCH"
            }),
        }),
    }),
})
export const { useCreateCourseMutation, useGetCreatorCourceQuery, useEditCourceMutation, useGetCourceByIdQuery, useCreateLectureMutation, useGetCourceLectureQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, usePublishUnbulishMutation, useRemoveCourceMutation, useGetPublishedCourcesQuery } = courseApi;