import { queryByText, render, renderHook, screen, waitFor, act } from "@testing-library/react"
import '@testing-library/jest-dom'
import TodoList from "./TodoList"
import { Provider, useDispatch } from "react-redux";
import { EntityState, configureStore } from "@reduxjs/toolkit";
import { renderWithProviders, wrapper } from "../../../utils/test-utils";
import { Todo, useAddTodoMutation, useGetTodosQuery } from "./todoApiSlice"
import { AppDispatch, setupStore } from "../../store";
import { useAppDispatch } from "../../hooks";
import { extendedApiSlice } from './todoApiSlice';
//import { server } from "../../test/mocks/server"
import { setupServer } from 'msw/node'
import { http, HttpResponse, delay } from "msw";
import fetchMock from "jest-fetch-mock";
import { PropsWithChildren } from "react";
import { server } from '../../../mocks/node'

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

/*beforeEach((): void => {
    fetchMock.resetMocks();
});*/

/*export const wrapper: React.FC = () => {
    const storeRef = setupStore(extendedApiSlice, { auth: useGetTodosQuery });
    return <Provider store={storeRef}></Provider>;
};*/


describe('TodoList', () => {
    
    test('uses preloaded state to render', async () => {
        //const initialTodos:Todo[] = [{ id: 5, user_id:'',title:'New todo', due_on:'',status:'pending' }]
        /*const store = setupStore()

        //store.dispatch(extendedApiSlice.endpoints.addTodo({ id: 5, user_id:'',title:'New todo', due_on:'',status:'pending' }))
        
        //const { getByText } = renderWithProviders(<TodoList/>, { store })

        const { getByText, queryByText, getByRole } = renderWithProviders(<TodoList/>)

        expect(queryByText(/Загрузка.../i)).toBeInTheDocument()

        await waitFor(() => {
            expect(getByText(/Удалить/i)).toBeInTheDocument()
        })*/
        /*server.use(
            HttpResponse
        )*/
    })
    test('render list of todos', async () => {
        const store = setupStore()
        const { getByText } = renderWithProviders(<TodoList/>, { store })
        //const { data } = await store.dispatch(extendedApiSlice.endpoints.getTodos.initiate());
        //expect(data).toBeUndefined();
        //const { result } = renderHook(() => useGetTodosQuery(), { wrapper })
        expect(await getByText('test2')).toBeVisible()
        //store.dispatch(extendedApiSlice.endpoints.getTodos.initiate(undefined))
        //const list = await screen.queryAllByTestId('card')
        await waitFor(() => {
            //const todos = queryAllByTestId('card')
            //expect(todos).toHaveLength(2)
            //expect(list.length).to(10);
            expect(screen.getByText('test2')).toBeVisible()
        })
        //const storeRef = setupStore(extendedApiSlice);
        /*fetchMock.mockResponse(JSON.stringify([{
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
        }]));*/

        //expect(await screen.findByText(/test2/i)).toBeInTheDocument()

        //const { result } = renderHook(() => useGetTodosQuery(), { wrapper })

        /*const { result } = renderHook(() => useGetTodosQuery(), { wrapper })
        const store = setupStore()
        store.dispatch(extendedApiSlice.endpoints.getTodos.initiate())*/

        //const {  } = renderWithProviders(<TodoList/>, () => useGetTodosQuery())

        /*const initialResponse = result.current;
        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(true);
        await waitFor(() => {
            //expect(screen.findByText(/test2/i)).toBeInTheDocument()
            const nextResponse = result.current;
            expect(nextResponse.data).not.toBeUndefined(), { timeout: 25000 };
            expect(nextResponse.isLoading).toBe(false);
            expect(nextResponse.isSuccess).toBe(true);
         })*/

         /*await act(async () => {
            await waitFor(() => {
                const nextResponse = result.current;
                expect(nextResponse.data).not.toBeUndefined();
                expect(nextResponse.isLoading).toBe(false);
                expect(nextResponse.isSuccess).toBe(true);
            });
          });*/
        //expect(nextResponse.isSuccess).toBe(true);
        //await waitForNextUpdate({ timeout: updateTimeout });
        //expect(await screen.findByText(/test2/i)).toBeInTheDocument()
    })

    /*test('button delete render correctly', () => {

        renderWithProviders(<TodoList/>)
        const buttonElement = screen.getByText(/Добавить/i)
        expect(buttonElement).toBeDefined()
    })*/
})