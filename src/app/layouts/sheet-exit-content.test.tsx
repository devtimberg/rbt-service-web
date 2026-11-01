import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { SheetExitContent } from './sheet-exit-content'

describe('SheetExitContent', () => {
  it('сохраняет вид заполненной формы после удаления маршрута, но исключает его из взаимодействия', () => {
    const { container, rerender } = render(
      <SheetExitContent active>
        <form>
          <input defaultValue="+7 (999) 123-45-67" />
          <textarea defaultValue="Исходный комментарий" />
        </form>
      </SheetExitContent>,
    )
    fireEvent.change(container.querySelector('textarea')!, { target: { value: 'Машина не сливает воду' } })
    rerender(<SheetExitContent active={false}>{null}</SheetExitContent>)

    expect(container.querySelector('form')).not.toBeNull()
    expect(container.querySelector('input')?.value).toBe('+7 (999) 123-45-67')
    expect(container.querySelector('textarea')?.value).toBe('Машина не сливает воду')
    expect(container.querySelector('[data-sheet-exit-content]')).toHaveAttribute('inert')
    expect(container.querySelector('[data-sheet-exit-content]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('при повторном открытии удаляет снимок и монтирует рабочие элементы новой страницы', () => {
    const click = vi.fn()
    const { container, rerender, getByRole } = render(
      <SheetExitContent active>
        <input defaultValue="Старая страница" />
      </SheetExitContent>,
    )
    rerender(<SheetExitContent active={false}>{null}</SheetExitContent>)
    rerender(
      <SheetExitContent active>
        <button onClick={click}>Новая страница</button>
      </SheetExitContent>,
    )

    expect(container.querySelector('input')).toBeNull()
    expect(container.querySelector('[data-sheet-exit-content]')).not.toHaveAttribute('inert')
    fireEvent.click(getByRole('button', { name: 'Новая страница' }))
    expect(click).toHaveBeenCalledOnce()
  })
})
