import { render, screen, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { SheetDecorationSlot, SheetDecorationSlotTarget } from './sheet-decoration-slot'

function Harness() {
  const anchor = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  return (
    <>
      <SheetDecorationSlotTarget />
      <div>
        <div ref={paper} data-testid="paper" />
        <div ref={anchor} data-testid="anchor" />
      </div>
      <SheetDecorationSlot anchorRef={anchor} layoutRef={paper}>
        <div data-testid="decoration" />
      </SheetDecorationSlot>
    </>
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('SheetDecorationSlot', () => {
  it('следует за точкой при изменении бумаги без изменения размеров родительского блока', async () => {
    const resize = new Map<Element, () => void>()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        private readonly callback: () => void
        constructor(callback: () => void) {
          this.callback = callback
        }
        observe(element: Element) {
          resize.set(element, this.callback)
        }
        disconnect() {
          resize.clear()
        }
      },
    )
    render(<Harness />)
    const anchor = screen.getByTestId('anchor')
    let top = 100
    anchor.getBoundingClientRect = () => new DOMRect(10, top, 0, 0)
    await waitFor(() =>
      expect(screen.getByTestId('decoration').parentElement).toHaveStyle({ transform: 'translate(10px, 100px)' }),
    )

    top = 122
    resize.get(screen.getByTestId('paper'))?.()
    expect(screen.getByTestId('decoration').parentElement).toHaveStyle({ transform: 'translate(10px, 122px)' })
  })
})
