import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { NavigationGuardProvider, useNavigationGuard } from './navigation-guard'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

const TOP_KEY = '__rbtFormTop'

type Guard = ReturnType<typeof useNavigationGuard>

function Probe({ onGuard }: { onGuard: (guard: Guard) => void }) {
  onGuard(useNavigationGuard())
  return null
}

/** Прокидывает актуальный API гарда из провайдера в тест (обновляется на каждый рендер контекста). */
function renderGuard() {
  let guard: Guard | undefined
  render(
    <NavigationGuardProvider>
      <Probe onGuard={(value) => (guard = value)} />
    </NavigationGuardProvider>,
  )
  return () => guard
}

/** Две свежие записи: origin — куда уходит подтверждённый Back, marker — становится базой служебной пары. */
function markHistory() {
  window.history.pushState({ origin: true }, '')
  window.history.pushState({ marker: true }, '')
}

afterEach(() => {
  push.mockReset()
})

describe('NavigationGuardProvider', () => {
  it('регистрация создаёт одну служебную пару и не дублируется', () => {
    const getGuard = renderGuard()
    const guard = getGuard()!
    const before = window.history.length

    const unregister = guard.register({ discard: () => {} })
    expect(window.history.length).toBe(before + 1)
    expect(window.history.state).toMatchObject({ [TOP_KEY]: true })

    // Повторная регистрация (возврат на форму, пара уже в истории) не растит историю.
    guard.register({ discard: () => {} })
    expect(window.history.length).toBe(before + 1)

    unregister()
  })

  it('назначение без блокера выполняется сразу, без подтверждения', () => {
    const getGuard = renderGuard()
    const guard = getGuard()!

    guard.navigate('/cart')
    expect(push).toHaveBeenCalledWith('/cart')
    expect(guard.pending).toBe(false)
  })

  it('Back с заполненной формой просит подтверждение; отмена возвращает на форму', async () => {
    markHistory()
    const getGuard = renderGuard()
    getGuard()!.register({ discard: () => {} })

    window.history.back()
    await vi.waitFor(() => expect(getGuard()!.pending).toBe(true))
    // Диалог открыт, но форма на месте: снова служебная вершина, не база.
    expect(window.history.state).toMatchObject({ [TOP_KEY]: true, marker: true })

    await act(async () => {
      getGuard()!.cancel()
    })
    expect(getGuard()!.pending).toBe(false)
    expect(window.history.state).toMatchObject({ [TOP_KEY]: true, marker: true })
  })

  it('подтверждение уходит на запись до служебной пары и сбрасывает форму', async () => {
    markHistory()
    const getGuard = renderGuard()
    const discard = vi.fn()
    getGuard()!.register({ discard })

    window.history.back()
    await vi.waitFor(() => expect(getGuard()!.pending).toBe(true))

    await act(async () => {
      getGuard()!.confirm()
    })
    expect(discard).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(window.history.state).toMatchObject({ origin: true }))
    expect(getGuard()!.pending).toBe(false)
  })

  it('Forward на маршрут после формы тоже просит подтверждение', async () => {
    markHistory()
    const getGuard = renderGuard()
    const first = getGuard()!.register({ discard: () => {} })

    // Уход с формы: блокер снят, в истории появился следующий маршрут.
    first()
    window.history.pushState({ next: true }, '')
    // Возврат к форме: перехвата нет (блокера нет), форма монтируется и регистрируется заново.
    window.history.back()
    await vi.waitFor(() => expect(window.history.state).toMatchObject({ [TOP_KEY]: true, marker: true }))
    const before = window.history.length
    const discard = vi.fn()
    getGuard()!.register({ discard })
    expect(window.history.length).toBe(before)

    // «Вперёд» на следующий маршрут требует подтверждения.
    window.history.forward()
    await vi.waitFor(() => expect(getGuard()!.pending).toBe(true))
    await act(async () => {
      getGuard()!.confirm()
    })
    expect(discard).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(window.history.state).toMatchObject({ next: true }))
    expect(getGuard()!.pending).toBe(false)
  })

  it('без блокера Back не перехватывается', async () => {
    markHistory()
    const getGuard = renderGuard()

    window.history.back()
    await vi.waitFor(() => expect(window.history.state).toMatchObject({ origin: true }))
    expect(getGuard()!.pending).toBe(false)
  })
})
