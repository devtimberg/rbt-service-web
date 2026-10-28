import { useState } from 'react'
import type { FilterGroup, PriceRange } from '@/entities/product'
import { cn } from '@/shared/lib/cn'
import { Box, Button, Checkbox, Label, Heading, Input, RadioGroup, RadioGroupItem, Text } from '@/shared/ui'
import styles from './catalog-filters.module.css'

type CatalogFiltersProps = {
  filterGroups: FilterGroup[]
  availabilityGroup: FilterGroup
  priceRange: PriceRange
  className?: string
}

export function CatalogFilters({ filterGroups, availabilityGroup, priceRange, className }: CatalogFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string>>>({})
  const [selectedAvailability, setSelectedAvailability] = useState('all')

  const activeCount = Object.values(selectedFilters).reduce((sum, set) => sum + set.size, 0)

  function toggleFilter(groupTitle: string, value: string) {
    setSelectedFilters((prev) => {
      const next = { ...prev }
      const set = new Set(next[groupTitle] ?? [])
      if (set.has(value)) {
        set.delete(value)
      } else {
        set.add(value)
      }
      next[groupTitle] = set
      return next
    })
  }

  function resetFilters() {
    setSelectedFilters({})
    setSelectedAvailability('all')
  }

  return (
    <Box as="aside" className={cn(styles.root, className)}>
      {/* Header */}
      <Box className={styles.header}>
        <Heading level={5} size="xs" className={styles.title}>
          Фильтры
        </Heading>
        {activeCount > 0 && (
          <Box className={styles.resetBox}>
            <Button variant="link" onClick={resetFilters} className={styles.reset}>
              Сбросить
            </Button>
            <Text as="span" className={styles.badge}>
              {activeCount}
            </Text>
          </Box>
        )}
      </Box>

      {/* Filter groups */}
      {filterGroups.map((group) => (
        <Box key={group.title} className={styles.group}>
          <Text className={styles.groupTitle}>{group.title}</Text>
          <Box className={styles.options}>
            {group.options.map((option) => {
              const checked = selectedFilters[group.title]?.has(option.value) ?? false
              return (
                <Label key={option.value} className={styles.option}>
                  <Checkbox checked={checked} onCheckedChange={() => toggleFilter(group.title, option.value)} />
                  <Text as="span" className={styles.optionText}>
                    {option.label}
                  </Text>
                  {option.count != null && (
                    <Text as="span" className={styles.optionCount}>
                      {option.count}
                    </Text>
                  )}
                </Label>
              )
            })}
          </Box>
        </Box>
      ))}

      {/* Price range */}
      <Box className={styles.group}>
        <Text className={styles.groupTitle}>Цена, ₽</Text>
        <Box className={styles.priceRow}>
          <Input type="text" placeholder={`от ${priceRange.min}`} className={styles.priceInput} />
          <Text as="span" className={styles.priceDash}>
            —
          </Text>
          <Input
            type="text"
            placeholder={`до ${priceRange.max.toLocaleString('ru-RU')}`}
            className={styles.priceInput}
          />
        </Box>
      </Box>

      {/* Availability */}
      <Box className={styles.group}>
        <Text className={styles.groupTitle}>{availabilityGroup.title}</Text>
        <RadioGroup value={selectedAvailability} onValueChange={setSelectedAvailability} className={styles.radioGroup}>
          {availabilityGroup.options.map((option) => (
            <Label key={option.value} className={styles.option}>
              <RadioGroupItem value={option.value} />
              <Text as="span" className={styles.optionLabel}>
                {option.label}
              </Text>
            </Label>
          ))}
        </RadioGroup>
      </Box>
    </Box>
  )
}
