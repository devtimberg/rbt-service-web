import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vite-plus/test'

// jsdom не реализует showModal/close у <dialog>: модалки (shared/ui/Dialog) открываются атрибутом open
// Проверяем через Reflect.has, а не `typeof proto.x`: чтение метода с прототипа без вызова — unbound-method
if (typeof HTMLDialogElement !== 'undefined') {
  const dialog = HTMLDialogElement.prototype
  if (!Reflect.has(dialog, 'showModal'))
    dialog.showModal = function (this: HTMLDialogElement) {
      this.open = true
    }
  if (!Reflect.has(dialog, 'close'))
    dialog.close = function (this: HTMLDialogElement) {
      if (!this.open) return
      this.open = false
      this.dispatchEvent(new Event('close'))
    }
}

afterEach(() => {
  cleanup()
})
