import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Box } from '../box'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '../description-list'
import { List, ListItem } from './list'

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
