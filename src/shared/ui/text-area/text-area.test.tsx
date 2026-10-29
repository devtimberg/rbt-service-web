import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vite-plus/test'
import { TextArea } from './text-area'

describe('TextArea', () => {
  it('подпись связана с полем, счётчик считает набранное', async () => {
    render(<TextArea label="Комментарий к заявке" name="comment" maxLength={255} />)
    const field = screen.getByLabelText('Комментарий к заявке')
    expect(screen.getByText('0/255')).toBeInTheDocument()
    await userEvent.type(field, 'Не греет')
    expect(screen.getByText('8/255')).toBeInTheDocument()
  })

  it('контролируемое значение задаёт счётчик', () => {
    render(<TextArea label="Комментарий" name="comment" maxLength={10} value="abc" onChange={() => {}} />)
    expect(screen.getByText('3/10')).toBeInTheDocument()
  })

  it('ошибка приоритетнее подсказки и связана через aria-describedby', () => {
    render(<TextArea label="Комментарий" name="comment" error="Слишком длинно" hint="Подсказка" />)
    const field = screen.getByLabelText('Комментарий')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('Слишком длинно')
    expect(screen.queryByText('Подсказка')).toBeNull()
  })
})
