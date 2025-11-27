import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../src/pages/Home'

describe('Home page', () => {
  it('renders heading', () => {
    render(<Home />)
    expect(screen.getByText(/Memory AI/)).toBeTruthy()
  })
})
