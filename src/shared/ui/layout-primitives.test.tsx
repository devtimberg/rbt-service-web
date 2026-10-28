import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vite-plus/test'
import { Box, Stack } from './Box'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from './DescriptionList'
import { Divider } from './Divider'
import { Heading } from './Heading'
import { Image } from './Image'
import { List, ListItem } from './List'
import { LineBreak, Text } from './Text'
import boxStyles from './Box.module.css'
import headingStyles from './Heading.module.css'

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
})

describe('List и DescriptionList', () => {
  it('ul по умолчанию, ol через as', () => {
    render(
      <>
        <List aria-label="Маркированный">
          <ListItem>Один</ListItem>
        </List>
        <List as="ol" aria-label="Нумерованный">
          <ListItem>Два</ListItem>
        </List>
      </>,
    )
    expect(screen.getByRole('list', { name: 'Маркированный' }).tagName).toBe('UL')
    expect(screen.getByRole('list', { name: 'Нумерованный' }).tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('dl, dt и dd, строка в Box', () => {
    const { container } = render(
      <DescriptionList className="flex flex-col">
        <Box className="flex justify-between">
          <DescriptionTerm>Товары</DescriptionTerm>
          <DescriptionDetails className="font-bold">1 000 ₽</DescriptionDetails>
        </Box>
      </DescriptionList>,
    )
    expect(container.querySelector('dl > div > dt')).toHaveTextContent('Товары')
    expect(container.querySelector('dl > div > dd')).toHaveClass('font-bold')
  })
})

describe('Image', () => {
  it('без sources это просто img', () => {
    const { container } = render(<Image src="/a.png" alt="Товар" width={80} height={80} className="size-20" />)
    expect(container.querySelector('picture')).toBeNull()
    expect(screen.getByRole('img', { name: 'Товар' })).toHaveClass('size-20')
  })

  it('с sources это picture с source перед img', () => {
    const { container } = render(
      <Image
        src="/desktop.png"
        alt="Баннер"
        sources={[
          { media: '(min-width: 1280px)', srcSet: '/wide.png' },
          { media: '(min-width: 768px)', srcSet: '/tablet.png' },
        ]}
      />,
    )
    const picture = container.querySelector('picture')
    expect(picture?.children).toHaveLength(3)
    expect(picture?.firstElementChild).toHaveAttribute('media', '(min-width: 1280px)')
    expect(picture?.lastElementChild?.tagName).toBe('IMG')
  })

  it('пустой sources всё равно оборачивает в picture', () => {
    const { container } = render(<Image src="/a.png" alt="" sources={[]} />)
    expect(container.querySelector('picture > img')).not.toBeNull()
  })
})

describe('Divider', () => {
  it('hr с классами как есть', () => {
    render(<Divider className="border-border-default" />)
    expect(screen.getByRole('separator')).toHaveClass('border-border-default')
  })
})
