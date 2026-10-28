import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Container } from './Container'
import styles from './Container.module.css'

describe('Container', () => {
  it('ставит класс модуля, дописывает внешний className и рендерит детей', () => {
    render(
      <Container className="py-8" data-testid="container">
        контент
      </Container>,
    )
    const container = screen.getByTestId('container')
    expect(container).toHaveClass(styles.root, 'py-8')
    expect(container).not.toHaveAttribute('data-slot')
    expect(container.textContent).toBe('контент')
  })
})
