import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the navbar, controls and grid', () => {
    render(<App />)

    expect(screen.getByText('A* Visualizer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /find path/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    expect(document.querySelectorAll('rect.grid-item').length).toBeGreaterThan(0)
  })
})
