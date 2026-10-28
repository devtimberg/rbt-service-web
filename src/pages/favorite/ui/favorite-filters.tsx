import { useState } from 'react'
import type { FilterGroup } from '@/entities/product'
import { cn } from '@/shared/lib/cn'
import { Box, Button, Checkbox, Label, Heading, RadioGroup, RadioGroupItem, Text } from '@/shared/ui'
import styles from './favorite-filters.module.css'

type FavoriteFiltersProps = {
  categories: string[]
  availabilityGroup: FilterGroup
  className?: string
}

export function FavoriteFilters({ categories, availabilityGroup, className }: FavoriteFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedAvailability, setSelectedAvailability] = useState('all')

  const activeCount = selectedCategories.size + (selectedAvailability !== 'all' ? 1 : 0)

  function toggleCategory(value: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }

  function resetFilters() {
    setSelectedCategories(new Set())
    setSelectedAvailability('all')
  }

  return (
    <Box as="aside" className={cn(styles.root, className)}>
      {/* Category */}
      <Box className={styles.group}>
        <Box className={styles.head}>
          <Heading level={5} size="xs" className={styles.title}>
            Категория
          </Heading>
          {activeCount > 0 && (
            <Box className={styles.reset}>
              <Button variant="link" onClick={resetFilters} className={styles.resetButton}>
                Сбросить
              </Button>
              <Text as="span" className={styles.count}>
                {activeCount}
              </Text>
            </Box>
          )}
        </Box>

        <Box className={styles.list}>
          {categories.map((category) => (
            <Label key={category} className={cn(styles.option, styles.optionTop)}>
              <Checkbox
                checked={selectedCategories.has(category)}
                onCheckedChange={() => toggleCategory(category)}
                className={styles.checkbox}
              />
              <Text as="span" className={cn(styles.optionText, styles.optionTextWrap)}>
                {category}
              </Text>
            </Label>
          ))}
        </Box>
      </Box>

      {/* Availability */}
      <Box className={styles.group}>
        <Text className={styles.availabilityTitle}>{availabilityGroup.title}</Text>
        <RadioGroup value={selectedAvailability} onValueChange={setSelectedAvailability} className={styles.radios}>
          {availabilityGroup.options.map((option) => (
            <Label key={option.value} className={cn(styles.option, styles.optionCenter)}>
              <RadioGroupItem value={option.value} />
              <Text as="span" className={styles.optionText}>
                {option.label}
              </Text>
            </Label>
          ))}
        </RadioGroup>
      </Box>
    </Box>
  )
}
