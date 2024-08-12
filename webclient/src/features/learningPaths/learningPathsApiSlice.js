import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const learningPathsAdapter = createEntityAdapter({});
const initialState = learningPathsAdapter.getInitialState();

export const learningPathsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLearningPaths: builder.query({
      query: () => "/lp",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
      // transformResponse: (responseData) => {
      //   console.log("responseData", responseData);
      //   const loadedPaths = responseData.learningPaths.map((path) => {
      //     path.id = path._id;
      //     return path;
      //   });
      //   return learningPathsAdapter.setAll(initialState, loadedPaths);
      // },
      // providesTags: (result, error, arg) => {
      //   if (result?.ids) {
      //     return [{ type: "LearningPath", id: "LIST" }, ...result.ids.map((id) => ({ type: "LearningPath", id }))];
      //   } else return [{ type: "LearningPath", id: "LIST" }];
      // },
    }),
  }),
});

export const { useGetLearningPathsQuery } = learningPathsApiSlice;

// // returns the query result object
// export const selectLearningPathsResult = learningPathsApiSlice.endpoints.getLearningPaths.select();

// // creates memoized selector
// const selectLearningPathsData = createSelector(
//   selectLearningPathsResult,
//   (learningPathsResult) => learningPathsResult.data // normalized state object with ids & entities
// );

// // getSelectors creates these selectors and we rename them with aliases using ES6 destructuring
// export const {
//   selectAll: selectAllLearningPaths,
//   selectById: selectLearningPathById,
//   selectIds: selectLearningPathIds,
//   // pass in a selector that returns the learning paths slice of state
// } = learningPathsAdapter.getSelectors((state) => selectLearningPathsData(state) ?? initialState);
