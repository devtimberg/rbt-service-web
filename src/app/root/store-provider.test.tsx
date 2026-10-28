import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { StoreProvider } from './store-provider'

describe('StoreProvider', () => {
  it('рендерит детей', () => {
    render(<StoreProvider>внутри</StoreProvider>)
    expect(screen.getByText('внутри')).toBeTruthy()
  })
})
