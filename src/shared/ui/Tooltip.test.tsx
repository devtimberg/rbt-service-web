import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vite-plus/test'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('Esc скрывает подсказку при фокусе на триггере, повторный фокус возвращает', async () => {
    render(
      <Tooltip content="Подсказка">
        <button type="button">Кнопка</button>
      </Tooltip>,
    )
    const tip = screen.getByRole('tooltip', { hidden: true })
    expect(tip).not.toHaveAttribute('data-dismissed')
    await userEvent.tab()
    await userEvent.keyboard('{Escape}')
    expect(tip).toHaveAttribute('data-dismissed', 'true')
    await userEvent.tab()
    await userEvent.tab({ shift: true })
    expect(tip).not.toHaveAttribute('data-dismissed')
  })

  it('Esc скрывает подсказку при наведении курсора', async () => {
    render(
      <Tooltip content="Подсказка">
        <button type="button">Кнопка</button>
      </Tooltip>,
    )
    const tip = screen.getByRole('tooltip', { hidden: true })
    await userEvent.hover(screen.getByRole('button'))
    await userEvent.keyboard('{Escape}')
    expect(tip).toHaveAttribute('data-dismissed', 'true')
  })
})
