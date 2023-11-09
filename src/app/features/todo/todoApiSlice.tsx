import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

export interface Todo {
    id: number,
    user_id: number,
    title: string,
    due_on: string,
    status: string
}

const todosAdapter = createEntityAdapter<Todo>({
    sortComparer: (a, b) => b.due_on.localeCompare(a.due_on)
}) 

const initialState = todosAdapter.getInitialState({
    status: 'idle',
    error: null,
    count: 0
  })

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTodos: builder.query<EntityState<Todo>, void>({
            query: () => '/todos',
            transformResponse: (responseData: Todo[], meta) => {

                return todosAdapter.setAll(initialState, responseData)
            },
            providesTags: ( result ) => 
                result
                ? [
                    ...result.ids.map(id => ({ type: 'Todo' as const, id })),
                    { type: 'Todo', id: 'LIST' },
                    ]
                : [{ type: 'Todo', id: 'LIST' }],
        }),
        addTodo: builder.mutation({
            query: initialTodo => ({
                url: `/users/${initialTodo.user_id}/todos`,
                method: 'POST',
                body: initialTodo
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Todo' as const, id: arg.id }
              ]
        }),
        updateTodo: builder.mutation({
            query: initialTodo => ({
                url: `/users/${initialTodo.user_id}/todos`,
                method: 'PUT',
                body: initialTodo
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Todo' as const, id: arg.id }
              ]
        }),
        deleteTodo: builder.mutation({
            query: initialTodo => ({
                url: `users/${initialTodo.user_id}/todos`,
                method: 'DELETE',
                body: initialTodo
            })
        })
    })
})

export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = extendedApiSlice