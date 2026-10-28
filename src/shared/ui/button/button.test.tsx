import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Button } from './button'
import styles from './button.module.css'

describe('Button', () => {
  it('по умолчанию type=button и срабатывает по клику', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Купить</Button>)
    const button = screen.getByRole('button', { name: 'Купить' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('loading блокирует кнопку и помечает занятой', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Отправить
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Отправить' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('со href рендерится ссылкой с классами кнопки', () => {
    render(
      <Button href="https://example.com" variant="secondary">
        Подробнее
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Подробнее' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveClass(styles.root, styles.variantSecondary)
  })
})

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
