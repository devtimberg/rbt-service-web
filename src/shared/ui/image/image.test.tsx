import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Image } from './image'

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
