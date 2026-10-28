import * as React from 'react'
import { createPortal } from 'react-dom'
import { type Part, searchCategories, searchParts } from '@/features/search-products'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/formatPrice'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Form } from '@/shared/ui/Form'
import { IconButton } from '@/shared/ui/IconButton'
import { ChevronRightIcon, ClearIcon, SearchOutlineIcon } from '@/shared/ui/icons'
import { Input } from '@/shared/ui/Input'
import { Skeleton } from '@/shared/ui/Skeleton'
import { SmartLink } from '@/shared/ui/SmartLink'
import { Text } from '@/shared/ui/Text'
import styles from './CatalogSearch.module.css'

const FAKE_DELAY = 600

type CatalogSearchProps = {
  expanded?: boolean
}

export function CatalogSearch({ expanded = false }: CatalogSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<string[]>([])
  const [results, setResults] = React.useState<Part[]>([])
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({})
  const hasQuery = query.length >= 2
  const showDropdown = focused && hasQuery

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (showDropdown && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [showDropdown, query, loading])

  const handleQueryChange = React.useCallback((value: string) => {
    setQuery(value)
    setFocused(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.length < 2) {
      setCategories([])
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(() => {
      setCategories(searchCategories(value))
      setResults(searchParts(value))
      setLoading(false)
    }, FAKE_DELAY)
  }, [])

  const handleClear = React.useCallback(() => {
    setQuery('')
    setCategories([])
    setResults([])
    setLoading(false)
    inputRef.current?.focus()
  }, [])

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }, [])

  const skeletonRows = (
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
  )

  const categoryRows = categories.length > 0 && (
    <Box className={styles.section}>
      <Text className={styles.sectionTitle}>Категории</Text>
      {categories.map((category) => (
        <Button
          variant="unstyled"
          key={category}
          type="button"
          className={styles.row}
          onClick={() => {
            setFocused(false)
          }}
        >
          <Text className={styles.name}>{category}</Text>
          <ChevronRightIcon className={styles.chevron} />
        </Button>
      ))}
    </Box>
  )

  const resultRows = results.length > 0 && (
    <Box className={styles.section}>
      <Text className={styles.sectionTitle}>Запчасти</Text>
      {results.map((part) => (
        <Button
          variant="unstyled"
          key={part.id}
          type="button"
          className={styles.row}
          onClick={() => {
            setQuery(part.name)
            setCategories([])
            setResults([])
            setFocused(false)
          }}
        >
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
  )

  const dropdown =
    showDropdown &&
    createPortal(
      <Box className={styles.dropdown} style={dropdownStyle}>
        {loading ? (
          skeletonRows
        ) : categories.length > 0 || results.length > 0 ? (
          <>
            {categoryRows}
            {resultRows}
          </>
        ) : (
          <Box className={styles.empty}>Ничего не найдено</Box>
        )}
      </Box>,
      document.body,
    )

  const clearButton = query.length > 0 && (
    <IconButton
      icon={ClearIcon}
      size="sm"
      variant="ghost"
      onClick={handleClear}
      aria-label="Очистить"
      className={styles.clear}
    />
  )

  return (
    <>
      {/* Mobile: link to search page */}
      <SmartLink
        href="/search"
        aria-label="Поиск запчастей"
        className={cn(styles.mobileLink, expanded ? styles.mobileExpanded : styles.mobileCompact)}
      >
        <SearchOutlineIcon
          className={cn(styles.mobileIcon, expanded ? styles.mobileIconExpanded : styles.mobileIconCompact)}
          aria-hidden
        />
        <Text
          as="span"
          className={cn(styles.mobileText, expanded ? styles.mobileTextExpanded : styles.mobileTextCompact)}
        >
          Поиск запчастей
        </Text>
      </SmartLink>

      {/* Desktop: search form — each element transitions only its own properties */}
      <search ref={wrapperRef} className={styles.search}>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <SearchOutlineIcon className={styles.icon} aria-hidden />
          <Input
            ref={inputRef}

            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setFocused(true)}
            className={styles.input}
            placeholder="Поиск запчастей по артикулу или названию..."
            autoComplete="off"
          />
          {clearButton}
        </Form>
        {dropdown}
      </search>
    </>
  )
}
