import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vite-plus/test'
import { TextInput } from '../text-input'
import { OtpField, TextField } from './text-field'
import inputStyles from '../text-input/text-input.module.css'

describe('TextInput и TextField', () => {
  it('TextInput стилизован и пробрасывает ref в input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TextInput ref={ref} aria-label="Имя" />)
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Имя' }))
    expect(ref.current).toHaveClass(inputStyles.root)
  })

  it('TextField: подпись, ошибка приоритетнее подсказки и связана через aria-describedby', () => {
    render(<TextField label="Email" name="email" error="Неверный email" hint="Подсказка" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Неверный email')
    expect(screen.queryByText('Подсказка')).toBeNull()
  })

  it('TextField: подсказка связана через aria-describedby', () => {
    render(<TextField label="Имя" name="name" hint="Как к вам обращаться" />)
    expect(screen.getByLabelText('Имя')).toHaveAccessibleDescription('Как к вам обращаться')
  })

  it('TextField: id вызывающего связывает подпись и поле, id описаний производны от него', () => {
    render(<TextField label="Email" name="email" id="custom" error="Ошибка" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id', 'custom')
    expect(input).toHaveAttribute('aria-describedby', 'custom-error')
  })

  it('TextField показывает подсказку без ошибки', () => {
    render(<TextField label="Имя" name="name" hint="Как к вам обращаться" />)
    expect(screen.getByText('Как к вам обращаться')).toBeInTheDocument()
    expect(screen.getByLabelText('Имя')).not.toHaveAttribute('aria-invalid')
  })

  it('OtpField: цифровой ввод фиксированной длины', () => {
    render(<OtpField length={6} />)
    const input = screen.getByLabelText('Код из письма')
    expect(input).toHaveAttribute('maxlength', '6')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  it('TextField: required добавляет звёздочку к подписи, className — на обёртке', () => {
    const { container } = render(<TextField label="Телефон" name="phone" required className="outer" />)
    expect(screen.getByLabelText('Телефон*')).toBeRequired()
    expect(container.firstElementChild).toHaveClass('outer')
  })
})
