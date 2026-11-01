import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vite-plus/test'
import { TextArea } from './text-area'
import styles from './text-area.module.css'

describe('TextArea', () => {
  it('подпись связана с полем, счётчик считает набранное', async () => {
    render(<TextArea label="Комментарий к заявке" name="comment" maxLength={255} />)
    const field = screen.getByLabelText('Комментарий к заявке')
    expect(screen.getByText('0/255')).toBeInTheDocument()
    await userEvent.type(field, 'Не греет')
    expect(screen.getByText('8/255')).toBeInTheDocument()
  })

  it('текст сверх лимита не обрезается, счётчик краснеет', async () => {
    render(<TextArea label="Комментарий" name="comment" maxLength={5} />)
    await userEvent.type(screen.getByLabelText('Комментарий'), 'Не греет')
    expect(screen.getByLabelText('Комментарий')).toHaveValue('Не греет')
    expect(screen.getByText('8/5')).toHaveClass(styles.counterError)
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
  it('пересчитывает высоту после программного восстановления многострочного значения', () => {
    const { rerender } = render(<TextArea label="Комментарий" name="comment" value="" onChange={() => {}} />)
    const field = screen.getByLabelText('Комментарий')
    Object.defineProperty(field, 'scrollHeight', { configurable: true, value: 240 })
    rerender(<TextArea label="Комментарий" name="comment" value={'Строка\n\nЕщё строка\n'} onChange={() => {}} />)
    expect(field).toHaveStyle({ height: '240px' })
    expect(field).toHaveValue('Строка\n\nЕщё строка\n')
  })
})
