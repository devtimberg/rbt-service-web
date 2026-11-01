import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vite-plus/test'
import { Tooltip } from './tooltip'

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

  it('возврат фокуса и hover после dialog не открывает подсказку до нового действия', () => {
    render(
      <>
        <Tooltip content="Подсказка">
          <button type="button">Триггер</button>
        </Tooltip>
        <dialog open>
          <button type="button">Закрыть</button>
        </dialog>
      </>,
    )
    const trigger = screen.getByRole('button', { name: 'Триггер' })
    const tip = screen.getByRole('tooltip', { hidden: true })
    fireEvent.click(trigger)
    fireEvent.blur(trigger)
    screen.getByRole('dialog').removeAttribute('open')
    fireEvent.focus(trigger)
    fireEvent.mouseEnter(trigger)
    expect(tip).toHaveAttribute('data-dismissed', 'true')
    fireEvent.mouseMove(trigger)
    expect(tip).not.toHaveAttribute('data-dismissed')
  })

  it('после возврата из dialog новый цикл фокуса снова разрешает подсказку', () => {
    render(
      <>
        <Tooltip content="Подсказка">
          <button type="button">Триггер</button>
        </Tooltip>
        <dialog open />
      </>,
    )
    const trigger = screen.getByRole('button', { name: 'Триггер' })
    const tip = screen.getByRole('tooltip', { hidden: true })
    fireEvent.click(trigger)
    fireEvent.blur(trigger)
    screen.getByRole('dialog').removeAttribute('open')
    fireEvent.focus(trigger)
    expect(tip).toHaveAttribute('data-dismissed', 'true')
    fireEvent.blur(trigger)
    fireEvent.focus(trigger)
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
