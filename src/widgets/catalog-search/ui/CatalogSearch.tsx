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
    <Box className="flex flex-col gap-1 p-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} className="flex items-center justify-between gap-4 px-2 py-2">
          <Box className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </Box>
          <Skeleton className="h-3.5 w-16 shrink-0" />
        </Box>
      ))}
    </Box>
  )

  const categoryRows = categories.length > 0 && (
    <Box className="flex flex-col">
      <Text className="px-5 pt-3 pb-1 text-xs font-medium text-gray-400">Категории</Text>
      {categories.map((category) => (
        <Button
          variant="unstyled"
          key={category}
          type="button"
          className="flex w-full items-center justify-between gap-4 px-5 py-3
            text-left transition-colors hover:bg-gray-50"
          onClick={() => {
            setFocused(false)
          }}
        >
          <Text className="text-primary-900 truncate text-sm font-medium">{category}</Text>
          <ChevronRightIcon className="size-4 shrink-0 text-gray-300" />
        </Button>
      ))}
    </Box>
  )

  const resultRows = results.length > 0 && (
    <Box className="flex flex-col">
      <Text className="px-5 pt-3 pb-1 text-xs font-medium text-gray-400">Запчасти</Text>
      {results.map((part) => (
        <Button
          variant="unstyled"
          key={part.id}
          type="button"
          className="flex w-full items-center justify-between gap-4 px-5 py-3
            text-left transition-colors hover:bg-gray-50"
          onClick={() => {
            setQuery(part.name)
            setCategories([])
            setResults([])
            setFocused(false)
          }}
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
  )

  const dropdown =
    showDropdown &&
    createPortal(
      <Box className="z-50 overflow-hidden rounded-lg bg-white shadow-xl" style={dropdownStyle}>
        {loading ? (
          skeletonRows
        ) : categories.length > 0 || results.length > 0 ? (
          <>
            {categoryRows}
            {resultRows}
          </>
        ) : (
          <Box className="px-5 py-6 text-center text-sm text-gray-400">Ничего не найдено</Box>
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
      className="text-gray-300"
    />
  )

  return (
    <>
      {/* Mobile: link to search page */}
      <SmartLink
        href="/search"
        aria-label="Поиск запчастей"
        className={cn(
          `flex w-full items-center gap-3 bg-white outline-none
          [-webkit-tap-highlight-color:transparent] focus:outline-none
          focus-visible:outline-none sm:hidden`,
          expanded ? 'h-18.5 rounded-[24px] px-5 py-2' : 'h-10 rounded-lg px-4 py-2',
        )}
      >
        <SearchOutlineIcon
          className={cn('text-input-placeholder shrink-0', expanded ? 'size-6' : 'size-5')}
          aria-hidden
        />
        <Text
          as="span"
          className={cn(
            `text-input-placeholder h-full min-w-0 flex-1 content-center
            leading-none`,
            expanded ? 'text-[18px]' : 'text-sm',
          )}
        >
          Поиск запчастей
        </Text>
      </SmartLink>

      {/* Desktop: search form — each element transitions only its own properties */}
      <search
        ref={wrapperRef}
        className="hidden w-full max-w-110 transition-[max-width] duration-500
          ease-in-out sm:block
          [@media(min-height:700px)]:group-data-home:max-w-185"
      >
        <Form
          onSubmit={handleSubmit}
          className="flex h-10 w-full items-center gap-3 rounded-lg bg-white
            py-2 pr-2 pl-4 transition-[height,padding,border-radius]
            duration-500 ease-in-out
            [@media(min-height:700px)]:group-data-home:h-18.5
            [@media(min-height:700px)]:group-data-home:rounded-[24px]
            [@media(min-height:700px)]:group-data-home:px-5
            [@media(min-height:700px)]:group-data-home:py-2"
        >
          <SearchOutlineIcon
            className="text-input-placeholder size-5 shrink-0
              transition-[width,height] duration-500 ease-in-out
              [@media(min-height:700px)]:group-data-home:size-6"
            aria-hidden
          />
          <Input
            ref={inputRef}

            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setFocused(true)}
            className="text-primary placeholder:text-input-placeholder min-w-0
              flex-1 bg-transparent text-sm leading-none transition-[font-size]
              duration-500 ease-in-out outline-none
              [@media(min-height:700px)]:group-data-home:text-[18px]"
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
