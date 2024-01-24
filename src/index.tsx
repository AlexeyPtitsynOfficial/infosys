import ReactDOM from 'react-dom/client';
import { App } from './App'
import { AppStore, setupStore, RootState } from './app/store'
import { Provider } from 'react-redux'
import React from 'react'
import { extendedApiSlice } from './app/features/posts/postSlice';
import { fetchUsers } from './app/features/users/usersSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
//import { server } from './mocks/node'

//server.listen()

const store = setupStore()
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate())
store.dispatch(fetchUsers())

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <ApiProvider api={extendedApiSlice}>
            <Provider store={store}>
                <Router>
                    <Routes>
                        <Route path='/*' element={<App/>}/> 
                    </Routes>
                </Router>
            </Provider>
        </ApiProvider>
    </React.StrictMode>)
