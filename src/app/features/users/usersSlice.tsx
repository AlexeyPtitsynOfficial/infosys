import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { apiSlice } from "../api/apiSlice";

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export interface User {
    id: number,
    name: string,
}

export interface UsersRequest {
    users: User[], status: string, error: any
}

const initialState: UsersRequest = {
    users: [],
    status: 'idle',
    error: null
  }

export const fetchUsers = createAsyncThunk('posts/fetchUsers', async () => {
    try {
      const response = await axios.get(USERS_URL)
      return [...response.data]
    } catch (err: any) {
      return err.message;
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {

            //return action.payload
            state.users = state.users.concat(action.payload)
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })

        
    }
})


export const selectAllUsers = (state: {users : UsersRequest; }) => state.users.users;

export const selectUserById = (state: {users : User[]; }, userId: number) => 
  state.users.find(user => user.id === userId)

export default usersSlice.reducer