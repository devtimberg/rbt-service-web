import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { LineBreak, Text } from './text'

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
})
