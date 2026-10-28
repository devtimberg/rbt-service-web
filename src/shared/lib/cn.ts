import { type ClassValue, clsx } from 'clsx'

/** Склейка классов. Конфликты решает порядок слоёв (`@layer components, slices` в app/styles/global.css), не слияние строк. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
