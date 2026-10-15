import { act, renderHook } from '@testing-library/react'
import type { ChangeEvent } from 'react'
import { describe, expect, it } from 'vite-plus/test'
import { useFormValues } from './useFormValues'

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>

describe('useFormValues', () => {
  it('правка поля убирает только его клиентскую ошибку', () => {
    const { result } = renderHook(() => useFormValues({ a: '', b: '' }))
    act(() => result.current.setErrors({ a: 'ошибка a', b: 'ошибка b' }))
    act(() => result.current.bind('a').onChange(change('x')))

    expect(result.current.values.a).toBe('x')
    expect(result.current.fieldError('a')).toBeUndefined()
    expect(result.current.fieldError('b')).toBe('ошибка b')
  })

  it('правка поля убирает только его серверную ошибку', () => {
    const { result } = renderHook(() => useFormValues({ a: '', b: '' }))
    const server = { a: 'сервер a', b: 'сервер b' }
    expect(result.current.fieldError('a', server)).toBe('сервер a')

    act(() => result.current.bind('a').onChange(change('x')))
    expect(result.current.fieldError('a', server)).toBeUndefined()
    expect(result.current.fieldError('b', server)).toBe('сервер b')
  })

  it('новая отправка снова показывает серверную ошибку отредактированного поля', () => {
    const { result } = renderHook(() => useFormValues({ a: '' }))
    act(() => result.current.bind('a').onChange(change('x')))
    act(() => result.current.setErrors({}))
    expect(result.current.fieldError('a', { a: 'сервер' })).toBe('сервер')
  })
})
