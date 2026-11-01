'use client'

import { Component, createRef, type ReactNode } from 'react'
import { Box } from '@/shared/ui'
import styles from './sheet-layout.module.css'

type Props = { active: boolean; children: ReactNode }
type Snapshot = { element: HTMLDivElement; scroll: { element: HTMLElement; top: number; left: number }[] }

/**
 * Снимок уходящей шторки до того, как Next заменит DOM маршрута.
 * Это только изображение интерфейса: обработчики не копируются, корень inert и aria-hidden.
 * Хранение ReactNode не подходит: LayoutRouter внутри children уже читает новый маршрут.
 */
export class SheetExitContent extends Component<Props> {
  private readonly container = createRef<HTMLDivElement>()

  override getSnapshotBeforeUpdate(previous: Props): Snapshot | null {
    const element = this.container.current
    if (!element) return null
    if (!previous.active && this.props.active) {
      // Удаляем неуправляемый снимок перед монтированием нового React-содержимого.
      element.replaceChildren()
    }
    if (!previous.active || this.props.active) return null

    const snapshot = element.cloneNode(true) as HTMLDivElement
    const scroll: Snapshot['scroll'] = []
    const originals = element.querySelectorAll<HTMLElement>('*')
    const copies = snapshot.querySelectorAll<HTMLElement>('*')
    originals.forEach((original, index) => {
      const copy = copies[index]
      if (!copy) return
      // cloneNode не переносит текущую прокрутку и введённое значение textarea.
      if (original.scrollTop || original.scrollLeft) {
        scroll.push({ element: copy, top: original.scrollTop, left: original.scrollLeft })
      }
      if (original instanceof HTMLInputElement && copy instanceof HTMLInputElement) {
        copy.value = original.value
        copy.checked = original.checked
      }
      if (original instanceof HTMLTextAreaElement && copy instanceof HTMLTextAreaElement) copy.value = original.value
      if (original instanceof HTMLSelectElement && copy instanceof HTMLSelectElement)
        copy.selectedIndex = original.selectedIndex
    })
    return { element: snapshot, scroll }
  }

  override componentDidUpdate(_previous: Props, _state: unknown, snapshot: Snapshot | null) {
    if (!snapshot) return
    this.container.current?.append(snapshot.element)
    // Прокрутку можно восстановить только после вставки: в отсоединённом DOM нет размеров.
    for (const { element, top, left } of snapshot.scroll) {
      element.scrollTop = top
      element.scrollLeft = left
    }
  }

  override render() {
    return (
      <Box
        ref={this.container}
        className={styles.exitContent}
        inert={!this.props.active}
        aria-hidden={!this.props.active || undefined}
        data-sheet-exit-content=""
      >
        {this.props.active ? this.props.children : null}
      </Box>
    )
  }
}
