import {
    createSelector,
    createEntityAdapter,
    EntityState,
  } from '@reduxjs/toolkit'
import { apiSlice } from "../api/apiSlice";
import { RootState } from '../../store';

export interface User {
    id: number,
    name: string,
    email: string,
    gender: string,
    hashed_password: string,
    status: string,
    is_active: boolean,
    phone: string,
    role_id: number
}
  
const usersAdapter = createEntityAdapter<User>({
    sortComparer: (a, b) => b.name.localeCompare(a.name)
})

const initialState = usersAdapter.getInitialState({
    status: 'idle',
    error: null,
    count: 0
})

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query<EntityState<User>, void>({
            query: () => '/users/',
            keepUnusedDataFor: 5,
            transformResponse: (responseData: User[], meta) => {

                const loadedUsers = responseData;

                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result) => 
            result
            ? [
                ...result.ids.map(id => ({ type: 'User' as const, id })),
                { type: 'User', id: 'LIST' },
            ]
            :[{type: 'User', id: 'LIST'}]

            
        }),
        addUser: builder.mutation({
            query: initialUser => ({
                url: `/users/`,
                method: 'POST',
                body: {
                    ...initialUser
                }
            })
        }),
        updateUser: builder.mutation({
            query: initialUser => ({
                url: `/users/${initialUser.id}`,
                method: 'PUT',
                body: {
                    ...initialUser
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User' as const, id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query:  id => ({
                url: `/users/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        })
        
    })
})

export const {
    useGetUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice


export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const {
    selectById: selectUserById,
    selectIds: selectUserIds,
    selectAll: selectAllUsers
} = usersAdapter.getSelectors<RootState>(state => selectUsersData(state) ?? initialState)