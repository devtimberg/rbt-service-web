import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { SelectPicker } from './select-picker'

const OPTIONS = [
  { value: 'cooktop', label: 'Варочная панель' },
  { value: 'fridge', label: 'Холодильник' },
]

/** jsdom не реализует matchMedia: стабот с нужным ответом (matches=true — десктопная панель, false — шторка). */
function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SelectPicker', () => {
  it('открывает панель по клику и выбирает пункт', async () => {
    stubMatchMedia(true)
    const onValueChange = vi.fn<(value: string) => void>()
    render(<SelectPicker label="Вид техники" name="kind" value="" options={OPTIONS} onValueChange={onValueChange} />)

    const trigger = screen.getByRole('button', { name: 'Вид техники' })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const panel = screen.getByRole('dialog')
    await userEvent.click(within(panel).getByRole('button', { name: 'Холодильник' }))
    expect(onValueChange).toHaveBeenCalledWith('fridge')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('Enter выбирает активный пункт, Escape закрывает панель и возвращает фокус на триггер', async () => {
    stubMatchMedia(true)
    const onValueChange = vi.fn<(value: string) => void>()
    render(
      <SelectPicker label="Вид техники" name="kind" value="cooktop" options={OPTIONS} onValueChange={onValueChange} />,
    )

    const trigger = screen.getByRole('button', { name: 'Вид техники' })
    await userEvent.click(trigger)
    // Активная опция совпадает со значением; фокус в неё уходит кадром позже открытия.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Варочная панель' })).toHaveFocus())

    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Холодильник' })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('fridge')

    await userEvent.click(trigger)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Варочная панель' })).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('пункт «Не выбрано» отдаёт пустую строку', async () => {
    stubMatchMedia(true)
    const onValueChange = vi.fn<(value: string) => void>()
    render(
      <SelectPicker label="Вид техники" name="kind" value="fridge" options={OPTIONS} onValueChange={onValueChange} />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Вид техники' }))
    const panel = screen.getByRole('dialog')
    await userEvent.click(within(panel).getByRole('button', { name: 'Не выбрано' }))
    expect(onValueChange).toHaveBeenCalledWith('')
  })

  it('ошибка объявляется через aria-invalid и описание, значение лежит в скрытом поле', () => {
    stubMatchMedia(true)
    const { container } = render(
      <SelectPicker label="Вид техники" name="kind" value="fridge" options={OPTIONS} error="Выберите технику" />,
    )

    const trigger = screen.getByRole('button', { name: 'Вид техники' })
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveAccessibleDescription('Выберите технику')

    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"]')
    expect(hidden).not.toBeNull()
    expect(hidden).toHaveAttribute('name', 'kind')
    expect(hidden?.value).toBe('fridge')
  })

  it('на мобильном открывается шторкой и выбирает пункт', async () => {
    stubMatchMedia(false)
    const onValueChange = vi.fn<(value: string) => void>()
    render(<SelectPicker label="Вид техники" name="kind" value="" options={OPTIONS} onValueChange={onValueChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Вид техники' }))
    const sheet = screen.getByRole('dialog')
    await userEvent.click(within(sheet).getByRole('button', { name: 'Варочная панель' }))
    expect(onValueChange).toHaveBeenCalledWith('cooktop')
  })
})
