import { Button, Card, CardActions, CardContent, Checkbox, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';

import { FunctionComponent, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useState } from "react"
import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from './todoApiSlice';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { selectAllUsers, useGetUsersQuery } from '../users/usersApiSlice';
import { selectPostById } from '../posts/postSlice';
import TodoAuthor from './TodoAuthor';
import { useDispatch } from 'react-redux';

const TodoList: FunctionComponent = () => {
    const dispatch = useDispatch()
    
    const [newTodo, setNewTodo] = useState({ user_id:'', user: 'Ivanov Ivan', title: '', status: 'pending'});

    /*const { refetch,
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery()*/

    const todoQuery = useGetTodosQuery()

    const [addTodo] = useAddTodoMutation()
    const [updateTodo] = useUpdateTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()

    const { 
    } = useGetUsersQuery()
    
    const users = useAppSelector(selectAllUsers)

    const handleSelectChange = (e: SelectChangeEvent) => {
        setNewTodo({...newTodo, [e.target.name]: e.target.value})
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        addTodo(newTodo)
        setNewTodo({ user_id:'', user: 'Ivanov Ivan', title: '', status: 'pending'})
    }

    const usersOptions = users.map(user=> (
        <MenuItem id="userId" key={user.id} value={user.id}>{user.name}</MenuItem>
    ))

    const newItemSection = (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="postUsersLabel">Автор</InputLabel>
                            <Select
                                labelId="postUsersLabel" size='small'
                                id="user_id"
                                value={String(newTodo.user_id)}
                                label="Автор"
                                name="user_id"
                                onChange={handleSelectChange}
                                >
                                {usersOptions}
                            </Select>
                        </FormControl>
                        <TextField id="new-todo" size='small' fullWidth name="title"
                            value={newTodo.title} onChange={(e) => setNewTodo({...newTodo, [e.target.name]: e.target.value})}
                            placeholder="Введите новую задачу"
                        />
                        <Button type='submit' variant='contained'>Добавить</Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    )

    let content
    if (todoQuery.isLoading) {
        content = <p>Загрузка...</p>
    } else if (todoQuery.isSuccess) {

        const {ids, entities} = todoQuery.data
        content = ids?.map(id => {
            return (
                <Card key={entities[id]?.id} data-testid="card">
                    <CardContent>
                        <Stack>
                            <Stack direction='row' alignItems='center'>
                                <Checkbox
                                    checked={entities[id]?.status == 'completed' ? true : false}
                                    id={entities[id]?.id.toString()}
                                    onChange={() => updateTodo({ ...entities[id], status: !entities[id]?.status })}
                                />
                                <Typography variant='body1'>{entities[id]?.title}</Typography>
                            </Stack>
                            <TodoAuthor user_id={entities[id]?.user_id}/>
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button className='trash' onClick={() => deleteTodo(id)}>
                            Удалить
                        </Button>
                    </CardActions>
                </Card>
            )
        })
    }

    return (
        <Stack spacing={1}>
            <Typography variant='h4'>Задачи</Typography>
            
            {content}
        </Stack>
    )
}

export default TodoList