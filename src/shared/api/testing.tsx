// Хелперы компонентных тестов со стором. НЕ реэкспортируется из index.ts, импорт: `@/shared/api/testing`.
//   const { store } = renderWithStore(<Component />)
import { render, type RenderResult } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { type AppStore, makeStore } from './store'

export function createTestStore(): AppStore {
  return makeStore()
}

/** Рендерит компонент внутри стора (по умолчанию новый). */
export function renderWithStore(
  ui: ReactElement,
  { store = createTestStore() }: { store?: AppStore } = {},
): RenderResult & { store: AppStore } {
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>
  return Object.assign(render(ui, { wrapper }), { store })
}
