import { apiSlice } from "../../app/api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    sendElapsedReadingTime: builder.mutation({
      query: (time) => ({
        url: "/profile/read-time",
        method: "PUT",
        body: time,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useSendElapsedReadingTimeMutation } = profileApiSlice;
