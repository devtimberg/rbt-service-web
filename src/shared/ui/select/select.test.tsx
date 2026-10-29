import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Select } from './select'
import styles from './select.module.css'

const OPTIONS = [
  { value: 'cooktop', label: 'Варочная панель' },
  { value: 'fridge', label: 'Холодильник' },
]

describe('Select', () => {
  it('подпись, опции и ошибка', () => {
    render(
      <Select
        label="Вид техники"
        name="kind"
        value=""
        options={OPTIONS}
        error="Выберите технику"
        required
        onChange={() => {}}
      />,
    )
    const select = screen.getByRole('combobox', { name: 'Вид техники*' })
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveAccessibleDescription('Выберите технику')
    expect(select).toHaveClass(styles.empty)
    expect(screen.getByRole('option', { name: 'Холодильник' })).toBeInTheDocument()
  })

  it('выбор значения', async () => {
    const onChange = vi.fn<(value: string) => void>()
    render(
      <Select
        label="Вид техники"
        name="kind"
        value="cooktop"
        options={OPTIONS}
        onChange={(event) => onChange(event.target.value)}
      />,
    )
    const select = screen.getByRole('combobox', { name: 'Вид техники' })
    expect(select).not.toHaveClass(styles.empty)
    await userEvent.selectOptions(select, 'fridge')
    expect(onChange).toHaveBeenCalledWith('fridge')
  })
})
