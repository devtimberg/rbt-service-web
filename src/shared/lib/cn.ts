import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Кастомных text-*/rounded-* в токенах нет (цвета и размеры стандартные), поэтому конфиг tailwind-merge по умолчанию.
// Если появятся свои размеры шрифта (--text-*) или радиусы, их нужно описать через extendTailwindMerge,
// иначе twMerge примет `text-h2` за цвет и вычеркнет рядом с `text-primary`.

/** Склейка классов с разрешением конфликтов Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
