import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('переключается кликом по подписи и пробелом, сообщает новое состояние', async () => {
    const onCheckedChange = vi.fn()
    function Demo() {
      const [checked, setChecked] = useState(false)
      return (
        <label>
          <Checkbox
            checked={checked}
            onCheckedChange={(next) => {
              setChecked(next)
              onCheckedChange(next)
            }}
          />
          В наличии
        </label>
      )
    }
    render(<Demo />)
    const user = userEvent.setup()

    await user.click(screen.getByText('В наличии'))
    expect(screen.getByRole('checkbox')).toBeChecked()

    await user.keyboard(' ')
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]])
  })

  it('indeterminate отдаёт aria-checked=mixed и состояние в DOM', () => {
    render(<Checkbox checked="indeterminate" aria-label="Все" onCheckedChange={() => {}} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Все' }) as HTMLInputElement
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox.indeterminate).toBe(true)
  })

  it('disabled не переключается', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox disabled aria-label="Под заказ" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
