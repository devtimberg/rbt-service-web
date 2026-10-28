import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { IconButton } from './icon-button'

describe('IconButton', () => {
  it('кнопка по умолчанию type=button, со href ссылка', () => {
    render(
      <>
        <IconButton aria-label="Закрыть" icon={() => <svg aria-hidden />} />
        <IconButton aria-label="Избранное" href="https://example.com" icon={() => <svg aria-hidden />} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute('href', 'https://example.com')
  })
})
