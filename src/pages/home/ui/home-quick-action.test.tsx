import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vite-plus/test'
import { HomeQuickAction } from './home-quick-action'

describe('HomeQuickAction', () => {
  it('открытый раздел — ссылка, закрытые — кнопки', () => {
    render(<HomeQuickAction />)
    expect(screen.getByRole('link', { name: /Вызвать\s+мастера/ })).toHaveAttribute('href', '/master-call')
    for (const name of [/Каталог/, /Статус/, /Услуги/, /Обратная/]) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-haspopup', 'dialog')
    }
  })

  it('закрытый раздел открывает окно «Этот раздел ещё в работе», крестик его закрывает', async () => {
    render(<HomeQuickAction />)
    await userEvent.click(screen.getByRole('button', { name: /Каталог/ }))
    const dialog = screen.getByRole('dialog', { name: 'Этот раздел ещё в работе' })
    expect(dialog).toHaveAccessibleDescription(/Мы запускаем сервис по частям/)
    expect(screen.getByRole('link', { name: '8-800-333-555-6' })).toHaveAttribute('href', 'tel:88003335556')
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
