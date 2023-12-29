import { Account } from "./../types/index";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./const";

// Define a service using a base URL and expected endpoints
export const accountApi = createApi({
  reducerPath: "accounts",
  tagTypes: ["AccountList"],
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => `accounts?_sort=id&_order=desc`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AccountList" as const, id })),
              { type: "AccountList", id: "LIST" },
            ]
          : [{ type: "AccountList", id: "LIST" }],
    }),
    addAccount: builder.mutation<Account, Omit<Account, "id">>({
      query: (body) => {
        return {
          method: "POST",
          url: `accounts`,
          body,
        };
      },
      invalidatesTags: [{ type: "AccountList", id: "LIST" }],
    }),
    editAccount: builder.mutation<
      Account,
      { body: Omit<Account, "id"> | Account; id: number }
    >({
      query: (payload) => {
        return {
          method: "PUT",
          url: `accounts/` + payload.id,
          body: payload.body,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "AccountList", id: arg.id }],
    }),
    deleteAccount: builder.mutation<Account, { id: number }>({
      query: (payload) => {
        return {
          method: "DELETE",
          url: `accounts/` + payload.id,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "AccountList", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAccountsQuery,
  useAddAccountMutation,
  useEditAccountMutation,
  useDeleteAccountMutation,
} = accountApi;
