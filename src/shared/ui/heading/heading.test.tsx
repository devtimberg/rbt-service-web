import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Heading } from './heading'
import headingStyles from './heading.module.css'

describe('Heading', () => {
  it('уровень задаёт тег, без size классов нет', () => {
    render(<Heading level={3}>Заголовок</Heading>)
    const heading = screen.getByRole('heading', { level: 3, name: 'Заголовок' })
    expect(heading).not.toHaveAttribute('class')
  })

  it('size добавляет класс модуля, className идёт следом', () => {
    render(
      <Heading level={1} size="xl" className="text-primary-500">
        Заказы
      </Heading>,
    )
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass(headingStyles.xl, 'text-primary-500')
  })

  it('level и size независимы', () => {
    render(
      <Heading level={2} size="xs">
        Мелкий h2
      </Heading>,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass(headingStyles.xs)
  })

  it('size h1–h6 даёт класс по текстовому стилю', () => {
    render(
      <Heading level={2} size="h4">
        Стиль h4
      </Heading>,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass(headingStyles.h4)
  })
})
