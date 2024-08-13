import { apiSlice } from "../../app/api/apiSlice";

export const assessmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentAssessments: builder.query({
      query: ({ email }) => ({
        url: "/student-assessments",
        method: "GET",
        params: { email },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ["EditorAssessment"],
    }),
    submitAssessment: builder.mutation({
      query: (assessment) => ({
        url: "/submit-assessment",
        method: "POST",
        body: assessment,
      }),
      invalidatesTags: ["EditorAssessment"],
    }),
  }),
});

export const { useGetStudentAssessmentsQuery, useSubmitAssessmentMutation } = assessmentsApiSlice;
