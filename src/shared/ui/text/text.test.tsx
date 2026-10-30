import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { LineBreak, Text } from './text'
import styles from './text.module.css'

describe('Text и LineBreak', () => {
  it('по умолчанию p без классов, as меняет элемент', () => {
    const { container } = render(
      <>
        <Text className="text-xs">Абзац</Text>
        <Text as="s">1 000 ₽</Text>
        <Text as="span">
          Адрес:
          <LineBreak />
          Москва
        </Text>
      </>,
    )
    expect(screen.getByText('Абзац').tagName).toBe('P')
    expect(screen.getByText('Абзац').getAttribute('class')).toBe('text-xs')
    expect(screen.getByText('1 000 ₽').tagName).toBe('S')
    expect(container.querySelector('span > br')).not.toBeNull()
  })

  it('variant и weight добавляют классы, className идёт следом', () => {
    render(
      <Text variant="body-sm" weight="semibold" className="extra">
        Текст
      </Text>,
    )
    expect(screen.getByText('Текст')).toHaveClass(styles['body-sm'], styles.semibold, 'extra')
  })

  it('без variant и weight класса нет', () => {
    render(<Text>Голый</Text>)
    expect(screen.getByText('Голый')).not.toHaveAttribute('class')
  })
})
