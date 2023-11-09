import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null},
    reducers: {
        setCredentials: (state, action) => {
            const { username, access_token } = action.payload
            state.user = username
            state.token = access_token
        },
        logOut: (state) => {
            state.user = null
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = ( state: RootState ) => state.auth.user
export const selectCurrentToken = ( state: RootState ) => '820e392eb63b8cce032f494dcf7f32ca785a7193479307bf0fee88a169dcc666'//state.auth.token

