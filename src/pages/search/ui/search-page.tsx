import * as React from 'react'
import { searchCategories, searchParts, useSearchStore } from '@/features/search-products'
import { formatPrice } from '@/shared/lib/formatPrice'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { ChevronRightIcon } from '@/shared/ui/icons'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Text } from '@/shared/ui/Text'

const FAKE_DELAY = 600

export function SearchPage() {
  const query = useSearchStore((s) => s.query)
  // Запрос, для которого «ответ пришёл»: обновляется с задержкой, пока он отстаёт от query, идёт загрузка
  const [settledQuery, setSettledQuery] = React.useState('')

  const hasQuery = query.length >= 2
  const loading = hasQuery && settledQuery !== query

  React.useEffect(() => {
    if (query.length < 2) return
    const timer = setTimeout(() => setSettledQuery(query), FAKE_DELAY)
    return () => clearTimeout(timer)
  }, [query])

  // Пока запрос не устоялся или слишком короткий, результатов нет
  const categories = React.useMemo(
    () => (hasQuery && !loading ? searchCategories(query) : []),
    [hasQuery, loading, query],
  )
  const results = React.useMemo(() => (hasQuery && !loading ? searchParts(query) : []), [hasQuery, loading, query])

  return (
    <Box className="flex grow flex-col">
      {loading && hasQuery && (
        <Box className="flex flex-col gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} className="flex items-center justify-between gap-4 px-2 py-3">
              <Box className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </Box>
              <Skeleton className="h-3.5 w-16 shrink-0" />
            </Box>
          ))}
        </Box>
      )}

      {!loading && hasQuery && categories.length > 0 && (
        <Box className="flex flex-col">
          <Text className="px-2 pt-3 pb-1 text-xs font-medium text-gray-400">Категории</Text>
          {categories.map((category) => (
            <Button
              variant="unstyled"
              key={category}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-2
                py-3 text-left transition-colors active:bg-gray-50"
            >
              <Text className="text-primary-900 truncate text-sm font-medium">{category}</Text>
              <ChevronRightIcon className="size-4 shrink-0 text-gray-300" />
            </Button>
          ))}
        </Box>
      )}

      {!loading && hasQuery && results.length > 0 && (
        <Box className="flex flex-col">
          <Text className="px-2 pt-3 pb-1 text-xs font-medium text-gray-400">Запчасти</Text>
          {results.map((part) => (
            <Button
              variant="unstyled"
              key={part.id}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-2
                py-3 text-left transition-colors active:bg-gray-50"
            >
              <Box className="min-w-0 flex-1">
                <Text className="text-primary-900 truncate text-sm font-medium">{part.name}</Text>
                <Text className="text-xs text-gray-400">{part.article}</Text>
              </Box>
              <Text as="span" className="text-primary-500 shrink-0 text-sm font-semibold">
                {formatPrice(part.price)} ₽
              </Text>
            </Button>
          ))}
        </Box>
      )}

      {!loading && hasQuery && results.length === 0 && categories.length === 0 && (
        <Box className="py-10 text-center text-sm text-gray-400">Ничего не найдено</Box>
      )}

      {!hasQuery && (
        <Box className="py-10 text-center text-sm text-gray-400">Введите название или артикул запчасти</Box>
      )}
    </Box>
  )
}
