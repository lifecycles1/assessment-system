import { apiSlice } from "../../app/api/apiSlice";

export const topicsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: (category) => ({
        url: `/topics/${category}`,
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ["Topic"],
    }),
    getTopic: builder.query({
      query: ({ category, topicId }) => ({
        url: `/topics/${category}/${topicId}`,
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ["Reply"],
    }),
    createTopic: builder.mutation({
      query: ({ title, message, category }) => ({
        url: "/createTopic",
        method: "POST",
        body: { title, message, category },
      }),
      invalidatesTags: ["Topic"],
    }),
    addReply: builder.mutation({
      query: ({ message, parentMessageId, parentMessageCreator, parentMessage, topicId }) => ({
        url: `/${topicId}/reply`,
        method: "POST",
        body: { message, parentMessageId, parentMessageCreator, parentMessage },
      }),
      invalidatesTags: ["Reply"],
    }),
    handleLike: builder.mutation({
      query: ({ type, messageId }) => ({
        url: `/${messageId}/like`,
        method: "POST",
        body: { type },
      }),
      invalidatesTags: ["Topic", "Reply"],
    }),
  }),
});

export const { useGetTopicsQuery, useGetTopicQuery, useCreateTopicMutation, useAddReplyMutation, useHandleLikeMutation } = topicsApiSlice;
