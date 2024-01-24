import { HttpResponse, http } from 'msw'
import { Todo } from '../app/features/todo/todoApiSlice'

export const handlers = [
    http.get('https://gorest.co.in/public/v2/todos', () => {
        return HttpResponse.json<Todo[]>([{
            id: 1,
            user_id: '1',
            title: 'test',
            due_on: '',
            status: 'active'
        },
        {
            id: 2,
            user_id: '2',
            title: 'test2',
            due_on: '',
            status: 'active'
        }])
    })
]