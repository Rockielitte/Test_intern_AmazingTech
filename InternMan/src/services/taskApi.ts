import { Account, Task } from "./../types/index";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./const";

// Define a service using a base URL and expected endpoints
export const taskApi = createApi({
  reducerPath: "tasks",
  tagTypes: ["TaskList"],
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => `tasks?_embed=assignments&_sort=id&_order=desc`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "TaskList" as const, id })),
              { type: "TaskList", id: "LIST" },
            ]
          : [{ type: "TaskList", id: "LIST" }],
    }),
    addTask: builder.mutation<Task, Omit<Task, "id" | "assignments">>({
      query: (body) => {
        return {
          method: "POST",
          url: `tasks/assignments`,
          body,
        };
      },
      invalidatesTags: [{ type: "TaskList", id: "LIST" }],
    }),
    editTask: builder.mutation<Task, { body: Task; id: number }>({
      query: (payload) => {
        return {
          method: "PUT",
          url: `tasks/${payload.id}/assignments`,
          body: payload.body,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "TaskList", id: arg.id }],
    }),
    deleteTask: builder.mutation<void, { id: number }>({
      query: (payload) => {
        return {
          method: "DELETE",
          url: `tasks/` + payload.id,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "TaskList", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
