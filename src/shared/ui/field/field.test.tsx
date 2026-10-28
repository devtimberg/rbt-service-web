import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Fieldset, Legend, Output } from './field'

describe('Fieldset, Legend и Output', () => {
  it('группа с названием и статус', () => {
    render(
      <>
        <Fieldset className="grid">
          <Legend className="sr-only">Способ получения</Legend>
          <input type="radio" aria-label="Самовывоз" />
        </Fieldset>
        <Output className="block">Ничего не найдено</Output>
      </>,
    )
    expect(screen.getByRole('group', { name: 'Способ получения' })).toHaveClass('grid')
    expect(screen.getByRole('status')).toHaveTextContent('Ничего не найдено')
  })
})
