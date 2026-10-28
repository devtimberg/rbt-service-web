import { screen } from '@testing-library/react'
import { useStore } from 'react-redux'
import { describe, expect, it } from 'vite-plus/test'
import { api } from './api'
import { makeStore } from './store'
import { createTestStore, renderWithStore } from './testing'

describe('makeStore', () => {
  it('подключает редьюсер api и создаёт независимые сторы', () => {
    const store = makeStore()
    expect(store.getState()).toHaveProperty(api.reducerPath)
    expect(makeStore()).not.toBe(store)
  })
})

describe('renderWithStore', () => {
  it('рендерит детей и отдаёт стор через провайдер', () => {
    const store = createTestStore()
    function Probe() {
      return <output>{useStore() === store ? 'да' : 'нет'}</output>
    }
    renderWithStore(<Probe />, { store })
    expect(screen.getByText('да')).toBeTruthy()
  })
})
