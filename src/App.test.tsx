import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { App } from './App'
import { renderWithProviders } from './utils/test-utils'


test('render main page', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/Информационная система/i)).toBeInTheDocument()
})