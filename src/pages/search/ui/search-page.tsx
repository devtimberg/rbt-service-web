'use client'

import * as React from 'react'
import { searchCategories, searchParts, useSearchStore } from '@/features/search-products'
import { formatPrice } from '@/shared/lib/format-price'
import { Box, Button, ChevronRightIcon, Skeleton, Text } from '@/shared/ui'
import styles from './search-page.module.css'

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
    <Box className={styles.root}>
      {loading && hasQuery && (
        <Box className={styles.skeletons}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} className={styles.skeletonRow}>
              <Box className={styles.skeletonText}>
                <Skeleton className={styles.skeletonTitle} />
                <Skeleton className={styles.skeletonSub} />
              </Box>
              <Skeleton className={styles.skeletonPrice} />
            </Box>
          ))}
        </Box>
      )}

      {!loading && hasQuery && categories.length > 0 && (
        <Box className={styles.section}>
          <Text className={styles.sectionTitle}>Категории</Text>
          {categories.map((category) => (
            <Button variant="unstyled" key={category} type="button" className={styles.row}>
              <Text className={styles.name}>{category}</Text>
              <ChevronRightIcon className={styles.chevron} />
            </Button>
          ))}
        </Box>
      )}

      {!loading && hasQuery && results.length > 0 && (
        <Box className={styles.section}>
          <Text className={styles.sectionTitle}>Запчасти</Text>
          {results.map((part) => (
            <Button variant="unstyled" key={part.id} type="button" className={styles.row}>
              <Box className={styles.partInfo}>
                <Text className={styles.name}>{part.name}</Text>
                <Text className={styles.article}>{part.article}</Text>
              </Box>
              <Text as="span" className={styles.price}>
                {formatPrice(part.price)} ₽
              </Text>
            </Button>
          ))}
        </Box>
      )}

      {!loading && hasQuery && results.length === 0 && categories.length === 0 && (
        <Box className={styles.empty}>Ничего не найдено</Box>
      )}

      {!hasQuery && <Box className={styles.empty}>Введите название или артикул запчасти</Box>}
    </Box>
  )
}
