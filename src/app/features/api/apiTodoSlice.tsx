import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Todos {
    id: number,
    title: string,
    completed: boolean
}
export const apiTodoSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3500'}),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query<Todos[], number>({
            query: () => '/todos',
            transformResponse: (res: Todos[]) => res.sort((a,b) => b.id - a.id),
            
        }),
        addTodo: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        updateTodo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PATCH',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Todos']
        })
    })
})

/*export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = apiTodoSlice*/