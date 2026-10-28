import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Button } from './Button'
import { IconButton } from './IconButton'
import styles from './Button.module.css'

describe('Button: unstyled', () => {
  it('только className, type=button и ref, без оболочки-span', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} variant="unstyled" className="text-sm font-medium">
        Показать
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Показать' })
    expect(button.getAttribute('class')).toBe('text-sm font-medium')
    expect(button).toHaveAttribute('type', 'button')
    expect(button.querySelector('span')).toBeNull()
    expect(ref.current).toBe(button)
  })

  it('пробрасывает type, disabled и обработчик', async () => {
    const onClick = vi.fn()
    render(
      <>
        <Button variant="unstyled" type="submit">
          Отправить
        </Button>
        <Button variant="unstyled" disabled onClick={onClick}>
          Недоступно
        </Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Отправить' })).toHaveAttribute('type', 'submit')
    const disabled = screen.getByRole('button', { name: 'Недоступно' })
    await userEvent.click(disabled)
    expect(disabled).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('Button: стилизованные варианты', () => {
  it('ghost и link дают разные классы, без data-slot', () => {
    render(
      <>
        <Button variant="ghost">Сбросить</Button>
        <Button variant="link">Ещё</Button>
      </>,
    )
    const ghost = screen.getByRole('button', { name: 'Сбросить' })
    expect(ghost).toHaveClass(styles.variantGhost)
    expect(ghost).not.toHaveAttribute('data-slot')
    expect(screen.getByRole('button', { name: 'Ещё' })).toHaveClass(styles.variantLink)
  })
})

describe('IconButton', () => {
  it('кнопка по умолчанию type=button, со href ссылка', () => {
    render(
      <>
        <IconButton aria-label="Закрыть" icon={() => <svg aria-hidden />} />
        <IconButton aria-label="Избранное" href="https://example.com" icon={() => <svg aria-hidden />} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute('href', 'https://example.com')
  })
})
