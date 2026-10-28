import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, type FormEvent } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Label } from '../field'
import { Input } from '../input'
import { Form } from './form'

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
