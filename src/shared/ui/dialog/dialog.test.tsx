import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { Dialog } from './dialog'

describe('Dialog', () => {
  it('открыт по пропу, назван заголовком, крестик закрывает', async () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Тип">
        Текст
      </Dialog>,
    )
    expect(screen.getByRole('dialog', { name: 'Тип' })).toHaveTextContent('Текст')
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('клик по затемнению закрывает, клик по содержимому нет', async () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Окно">
        <p>Внутри</p>
      </Dialog>,
    )
    await userEvent.click(screen.getByText('Внутри'))
    expect(onClose).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('dialog', { name: 'Окно' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('блокирует прокрутку страницы, пока открыт, и снимает блокировку при закрытии', () => {
    const { rerender } = render(<Dialog open onClose={() => {}} title="Окно" />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<Dialog open={false} onClose={() => {}} title="Окно" />)
    expect(document.body.style.overflow).toBe('')
  })
})
