import './styles.css'
import LOGO from '../public/react.png'

import Layout from './components/Layouts'
import Public from './components/Public'
import Login from './app/features/auth/Login'
import RequireAuth from './app/features/auth/RequireAuth'
import PostList from './app/features/posts/PostList'
import AddPostForm from './app/features/posts/AddPostForm'
import SinglePostPage from './app/features/posts/SinglePostPage'
import UsersList from './app/features/users/UsersList'
import UserPage from './app/features/users/UserPage'

import { Routes, Route, Navigate } from 'react-router-dom'
import TodoList from './app/features/todo/TodoList'
import RolesList from './app/features/roles/RolesList'

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout/>} >
        
        <Route index element={<Public/>}/>
        <Route path='login' element={<Login/>}/>

        <Route path='post'>
          <Route index element={<PostList/>}/>
          <Route path=':postId' element={<SinglePostPage/>} />
        </Route>

        <Route element={<RequireAuth />}>
        
          <Route path='roles'>
            <Route index element={<RolesList/>}/>
            <Route path=':userId' element={<UserPage/>} />
          </Route>

          <Route path='user'>
            <Route index element={<UsersList/>}/>
            <Route path=':userId' element={<UserPage/>} />
          </Route>

          <Route path='todo'>
            <Route index element={<TodoList />}/>
          </Route>
        </Route>

        <Route path='*' element={<Navigate to={'/'} replace />} />
      </Route>
    </Routes>
  )
}
