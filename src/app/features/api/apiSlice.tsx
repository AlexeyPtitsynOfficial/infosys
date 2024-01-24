import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../auth/authSlice";
import { RootState } from "../../store";

import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from '@reduxjs/toolkit/query'

const baseQuery = fetchBaseQuery({
    baseUrl:'https://gorest.co.in/public/v2',
    //credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        //const token = (getState() as RootState).auth.token
        const token = '820e392eb63b8cce032f494dcf7f32ca785a7193479307bf0fee88a169dcc666'
        if(token) {
            //headers.set("Access-Control-Allow-Origin", "*");
            headers.set('Authorization', `Bearer ${token}`);
            //headers.set("Content-Type", "application/x-www-form-urlencoded");
            headers.set("Content-Type", "application/json");
        }
        return headers
    },
})

const baseQueryWithReauth: BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 403) {
        console.log('sending refresh token')

        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if(refreshResult?.data) {
            const user = (api.getState() as RootState).auth.user
            api.dispatch(setCredentials({ ...refreshResult.data, user }))

            result = await baseQuery(args, api, extraOptions)
        }
        else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Post','Todo','User','Comment'],
    keepUnusedDataFor: 30,
    endpoints: builder => ({})
})