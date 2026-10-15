import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Button } from './Button'

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
    expect(link.className).toContain('bg-primary-100/10')
  })
})
