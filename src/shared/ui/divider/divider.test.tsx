import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Divider } from './divider'

describe('Divider', () => {
  it('hr с классами как есть', () => {
    render(<Divider className="border-border-default" />)
    expect(screen.getByRole('separator')).toHaveClass('border-border-default')
  })
})
