import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { PhoneField } from './phone-field'
import styles from './phone-field.module.css'

function PhoneHarness({ onValue }: { onValue?: (digits: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <PhoneField
      label="Введите номер телефона"
      name="phone"
      value={value}
      onValueChange={(digits) => {
        setValue(digits)
        onValue?.(digits)
      }}
    />
  )
}

describe('PhoneField', () => {
  it('без фокуса и значения поле пустое, в фокусе виден префикс', async () => {
    render(<PhoneHarness />)
    const input = screen.getByLabelText('Введите номер телефона')
    expect(input).toHaveValue('')
    expect(input).toHaveAttribute('inputmode', 'tel')
    expect(input).toHaveAttribute('autocomplete', 'tel-national')
    await userEvent.click(input)
    expect(input).toHaveValue('+7 (')
  })

  it('форматирует набираемые цифры и отдаёт 10 цифр без +7', async () => {
    const onValue = vi.fn()
    render(<PhoneHarness onValue={onValue} />)
    const input = screen.getByLabelText('Введите номер телефона')
    await userEvent.click(input)
    await userEvent.keyboard('9001')
    expect(input).toHaveValue('+7 (900) 1')
    await userEvent.keyboard('234567')
    expect(input).toHaveValue('+7 (900) 123-45-67')
    expect(onValue).toHaveBeenLastCalledWith('9001234567')
  })

  it('хвост маски показан серым призраком', async () => {
    const { container } = render(<PhoneHarness />)
    const input = screen.getByLabelText('Введите номер телефона')
    await userEvent.click(input)
    await userEvent.keyboard('900')
    expect(container.querySelector(`[aria-hidden] .${styles.rest}`)).toHaveTextContent(') ___-__-__')
  })

  it('Backspace по разделителю стирает цифру перед ним', async () => {
    render(<PhoneHarness />)
    const input = screen.getByLabelText('Введите номер телефона')
    await userEvent.click(input)
    await userEvent.keyboard('9001')
    expect(input).toHaveValue('+7 (900) 1')
    await userEvent.keyboard('{Backspace}{Backspace}')
    expect(input).toHaveValue('+7 (90')
    // «)» появляется только вместе с 4-й цифрой: Backspace по ней стирает «1», затем «0»
  })

  it('правка в середине: цифра вставляется в позицию каретки', async () => {
    render(<PhoneHarness />)
    const input = screen.getByLabelText('Введите номер телефона')
    await userEvent.click(input)
    await userEvent.keyboard('9003')
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}')
    await userEvent.keyboard('5')
    expect(input).toHaveValue('+7 (905) 03')
    // Backspace по пробелу после «)» стирает цифру «5» перед ним
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{Backspace}')
    expect(input).toHaveValue('+7 (900) 3')
  })

  it('вставка +7 и 8 нормализуется', async () => {
    render(<PhoneHarness />)
    const input = screen.getByLabelText('Введите номер телефона')
    await userEvent.click(input)
    await userEvent.paste('+7 (900) 123-45-67')
    expect(input).toHaveValue('+7 (900) 123-45-67')
  })

  it('короткий фрагмент вставляется в позицию каретки', async () => {
    render(<PhoneHarness />)
    const input = screen.getByLabelText('Введите номер телефона')
    await userEvent.click(input)
    await userEvent.keyboard('9007')
    await userEvent.keyboard('{ArrowLeft}')
    await userEvent.paste('12')
    expect(input).toHaveValue('+7 (900) 127')
  })

  it('ошибка выводится под полем и описывает его', () => {
    render(
      <PhoneField
        label="Телефон"
        name="phone"
        value=""
        onValueChange={() => {}}
        error="Введите корректный номер телефона"
      />,
    )
    expect(screen.getByLabelText('Телефон')).toHaveAccessibleDescription('Введите корректный номер телефона')
  })
})
