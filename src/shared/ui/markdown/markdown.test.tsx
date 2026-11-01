import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Markdown } from './markdown'

describe('Markdown', () => {
  it('сохраняет семантику документа и сдвигает заголовки под h1 страницы', () => {
    render(
      <Markdown headingOffset={1}>
        {'# Раздел\n\nТекст с **выделением** и [ссылкой](/privacy-policy).\n\n1. Первый пункт\n2. Второй пункт'}
      </Markdown>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Раздел' })).toBeInTheDocument()
    expect(screen.getByText('выделением').tagName).toBe('STRONG')
    expect(screen.getByRole('link', { name: 'ссылкой' })).toHaveAttribute('href', '/privacy-policy')
    expect(screen.getByRole('list').tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('не исполняет встроенный HTML из документа', () => {
    const { container } = render(
      <Markdown>
        {'Обычный текст\n\n<script>alert(1)</script>\n\n<iframe src="https://example.com"></iframe>'}
      </Markdown>,
    )
    expect(screen.getByText('Обычный текст')).toBeInTheDocument()
    expect(container.querySelector('script, iframe')).toBeNull()
  })
})
