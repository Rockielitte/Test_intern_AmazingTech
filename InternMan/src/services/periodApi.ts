import { Account, Period } from "./../types/index";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./const";

// Define a service using a base URL and expected endpoints
export const periodApi = createApi({
  reducerPath: "periods",
  tagTypes: ["periodsList"],
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getPeriods: builder.query<Period[], void>({
      query: () => `training-periods?_expand=account&_sort=id&_order=desc`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "periodsList" as const, id })),
              { type: "periodsList", id: "LIST" },
            ]
          : [{ type: "periodsList", id: "LIST" }],
    }),
    addPeriod: builder.mutation<
      Omit<Period, "account">,
      Omit<Period, "id" | "account">
    >({
      query: (body) => {
        return {
          method: "POST",
          url: `training-periods`,
          body,
        };
      },
      invalidatesTags: [{ type: "periodsList", id: "LIST" }],
    }),
    editPeriod: builder.mutation<
      Omit<Period, "account">,
      { body: Omit<Period, "id" | "account">; id: number }
    >({
      query: (payload) => {
        return {
          method: "PUT",
          url: `training-periods/` + payload.id,
          body: payload.body,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "periodsList", id: arg.id }],
    }),
    deletePeriod: builder.mutation<Period, { id: number }>({
      query: (payload) => {
        return {
          method: "DELETE",
          url: `training-periods/` + payload.id,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "periodsList", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPeriodsQuery,
  useAddPeriodMutation,
  useEditPeriodMutation,
  useDeletePeriodMutation,
} = periodApi;
