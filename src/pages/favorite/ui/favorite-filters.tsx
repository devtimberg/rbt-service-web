import { useState } from 'react'
import type { FilterGroup } from '@/entities/product'
import { cn } from '@/shared/lib/cn'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Label } from '@/shared/ui/Field'
import { Heading } from '@/shared/ui/Heading'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/RadioGroup'
import { Text } from '@/shared/ui/Text'

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
    <Box as="aside" className={cn('flex w-68! flex-col gap-6 rounded-[24px] bg-white p-6', className)}>
      {/* Category */}
      <Box className="flex flex-col gap-3">
        <Box className="flex items-center justify-between gap-3">
          <Heading level={5} size="xs" className="h-5 text-[16px]! font-bold!">
            Категория
          </Heading>
          {activeCount > 0 && (
            <Box className="flex gap-1.5">
              <Button
                variant="link"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-sm leading-[16px]"
              >
                Сбросить
              </Button>
              <Text
                as="span"
                className="bg-secondary-500 flex size-5 items-center
                  justify-center rounded-full text-xs font-medium text-white"
              >
                {activeCount}
              </Text>
            </Box>
          )}
        </Box>

        <Box className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <Label key={category} className="flex cursor-pointer items-start gap-2.5">
              <Checkbox
                checked={selectedCategories.has(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="mt-0.5"
              />
              <Text as="span" className="text-pretty text-sm">
                {category}
              </Text>
            </Label>
          ))}
        </Box>
      </Box>

      {/* Availability */}
      <Box className="flex flex-col gap-3">
        <Text className="cursor-default text-primary text-base font-medium">{availabilityGroup.title}</Text>
        <RadioGroup value={selectedAvailability} onValueChange={setSelectedAvailability} className="gap-2.5">
          {availabilityGroup.options.map((option) => (
            <Label key={option.value} className="flex cursor-pointer items-center gap-2.5">
              <RadioGroupItem value={option.value} />
              <Text as="span" className="text-sm">
                {option.label}
              </Text>
            </Label>
          ))}
        </RadioGroup>
      </Box>
    </Box>
  )
}
