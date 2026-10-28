import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vite-plus/test'
import { Box, Stack } from './box'
import boxStyles from './box.module.css'

describe('Box', () => {
  it('по умолчанию div без классов и атрибутов data-*', () => {
    const { container } = render(<Box>Блок</Box>)
    const box = container.firstElementChild
    expect(box?.tagName).toBe('DIV')
    expect(box).not.toHaveAttribute('class')
    expect(box).not.toHaveAttribute('data-slot')
  })

  it('as задаёт элемент, className, aria и ref уходят как есть', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Box as="nav" ref={ref} aria-label="Разделы" className="flex  gap-4">
        ссылки
      </Box>,
    )
    const nav = screen.getByRole('navigation', { name: 'Разделы' })
    expect(ref.current).toBe(nav)
    expect(nav.getAttribute('class')).toBe('flex  gap-4')
  })

  it('as принимает только блочные элементы', () => {
    // @ts-expect-error -- button не блок: для кнопок есть Button/IconButton
    const element = <Box as="button" />
    expect(element.props).toEqual({ as: 'button' })
  })
})

describe('Stack', () => {
  it('колонка с зазором, className перекрывает пропсы', () => {
    render(
      <Stack as="section" gap={4} align="center" aria-label="Секция" className="md:flex-row md:gap-6">
        x
      </Stack>,
    )
    const section = screen.getByRole('region', { name: 'Секция' })
    expect(section.className).toBe(
      `${boxStyles.stack} ${boxStyles.column} ${boxStyles.gap4} ${boxStyles.alignCenter} md:flex-row md:gap-6`,
    )
    expect(section).not.toHaveAttribute('style')
  })

  it('строка без flex-col', () => {
    const { container } = render(<Stack direction="row" gap={0.5} wrap justify="between" />)
    expect(container.firstElementChild?.className).toBe(
      `${boxStyles.stack} ${boxStyles.gap0_5} ${boxStyles.justifyBetween} ${boxStyles.wrap}`,
    )
  })
})
