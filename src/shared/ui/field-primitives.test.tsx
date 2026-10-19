import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, type FormEvent } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Fieldset, Label, Legend, Output } from './Field'
import { Form } from './Form'
import { Input } from './Input'
import { OtpField, TextField } from './TextField'
import { TextInput } from './TextInput'

describe('Form, Label и Input', () => {
  it('onSubmit формы, подпись связана с полем через htmlFor, Input без стилей', async () => {
    const onSubmit = vi.fn<(event: FormEvent) => void>((event) => event.preventDefault())
    const ref = createRef<HTMLInputElement>()
    render(
      <Form onSubmit={onSubmit} aria-label="Промокод">
        <Label htmlFor="code" className="sr-only">
          Промокод
        </Label>
        <Input ref={ref} id="code" className="h-10 bg-transparent" />
        <button type="submit">Применить</button>
      </Form>,
    )
    const input = screen.getByLabelText('Промокод', { selector: 'input' })
    expect(ref.current).toBe(input)
    expect(input.getAttribute('class')).toBe('h-10 bg-transparent')
    await userEvent.click(screen.getByRole('button', { name: 'Применить' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})

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

describe('TextInput и TextField', () => {
  it('TextInput стилизован и пробрасывает ref в input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TextInput ref={ref} aria-label="Имя" />)
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Имя' }))
    expect(ref.current).toHaveClass('h-9', 'rounded-md')
  })

  it('TextField: подпись, ошибка приоритетнее подсказки и связана через aria-describedby', () => {
    render(<TextField label="Email" name="email" error="Неверный email" hint="Подсказка" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Неверный email')
    expect(screen.queryByText('Подсказка')).toBeNull()
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
    expect(input).toHaveAttribute('placeholder', '000000')
  })
})
