import { CATALOG_CATEGORIES } from '@/entities/category'

// ВРЕМЕННО: мок-поиск до появления API каталога.
export type Part = {
  id: string
  name: string
  article: string
  price: number
}

const FAKE_PARTS: Part[] = [
  { id: '1', name: 'Компрессор холодильника Атлант', article: 'КМ-120', price: 8500 },
  { id: '2', name: 'Компрессор инверторный Samsung', article: 'DA97-15270A', price: 12400 },
  { id: '3', name: 'Термостат холодильника ТАМ-133', article: 'ТАМ-133-1М', price: 650 },
  { id: '4', name: 'Термостат K59-L1275 Ranco', article: 'K59-L1275', price: 890 },
  { id: '5', name: 'Мотор вентилятора No Frost', article: 'DG8-3J', price: 1200 },
  { id: '6', name: 'Модуль управления Indesit', article: 'C00293259', price: 4300 },
  { id: '7', name: 'Модуль управления Bosch', article: 'BSH-649559', price: 6800 },
  { id: '8', name: 'Уплотнитель двери Stinol 101', article: 'С00854017', price: 1100 },
  { id: '9', name: 'Уплотнитель двери Атлант МХМ', article: '769748901509', price: 980 },
  { id: '10', name: 'ТЭН оттайки Samsung', article: 'DA47-00263F', price: 1450 },
  { id: '11', name: 'ТЭН оттайки LG', article: '5300JB1092B', price: 1350 },
  { id: '12', name: 'Датчик температуры NTC Samsung', article: 'DA32-10105Q', price: 490 },
  { id: '13', name: 'Пусковое реле компрессора', article: 'РКТ-3', price: 320 },
  { id: '14', name: 'Лампа холодильника LED E14 3W', article: 'LED-E14-3W', price: 250 },
  { id: '15', name: 'Вентилятор морозильной камеры LG', article: '4680JB1026B', price: 1600 },
  { id: '16', name: 'Клапан электромагнитный двойной', article: 'КЭМ-2', price: 2100 },
  { id: '17', name: 'Петля двери холодильника Bosch', article: 'BSH-268698', price: 780 },
  { id: '18', name: 'Ручка двери холодильника Атлант', article: '775373400201', price: 450 },
  { id: '19', name: 'Фильтр-осушитель 15г', article: 'DCL-083S', price: 280 },
  { id: '20', name: 'Плата дисплея холодильника Samsung', article: 'DA41-00484A', price: 3700 },
]

const ALL_CATEGORIES = CATALOG_CATEGORIES.flatMap((group) => group.items)

export function searchCategories(query: string): string[] {
  const q = query.toLowerCase()
  return ALL_CATEGORIES.filter((c) => c.toLowerCase().includes(q))
}

export function searchParts(query: string): Part[] {
  const q = query.toLowerCase()
  return FAKE_PARTS.filter((p) => p.name.toLowerCase().includes(q) || p.article.toLowerCase().includes(q)).slice(0, 6)
}
