import { PreloadedState, combineReducers, configureStore } from "@reduxjs/toolkit";
import { RenderOptions, render } from "@testing-library/react";
import { RootState, AppStore, setupStore } from "../app/store";
import { PropsWithChildren } from "react";
import { Provider } from 'react-redux';
import { apiSlice } from "../app/features/api/apiSlice";
import authReducer from "../app/features/auth/authSlice";
import userReducer from '../app/features/users/usersSlice';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
}

export function renderWithProviders(
    ui : React.ReactElement,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ... renderOptions
    } : ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return <Provider store={ store }>{children}</Provider>
    }

    return {store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export const wrapper: React.FC = ({ children }: PropsWithChildren<{}>) => {
    const storeRef = setupStore();
    return <Provider store={ storeRef }>{children}</Provider>;
}