import { useState } from 'react'
import type { FilterGroup, PriceRange } from '@/entities/product'
import { cn } from '@/shared/lib/cn'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Label } from '@/shared/ui/Field'
import { Heading } from '@/shared/ui/Heading'
import { Input } from '@/shared/ui/Input'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/RadioGroup'
import { Text } from '@/shared/ui/Text'

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
    <Box as="aside" className={cn('flex w-68! flex-col gap-6 rounded-[24px] bg-white p-6', className)}>
      {/* Header */}
      <Box className="flex items-center justify-between gap-3">
        <Heading level={5} size="xs" className="h-5 text-[16px]! font-bold!">
          Фильтры
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

      {/* Filter groups */}
      {filterGroups.map((group) => (
        <Box key={group.title} className="flex flex-col gap-3">
          <Text className="cursor-default text-primary text-base font-medium">{group.title}</Text>
          <Box className="flex flex-col gap-2.5">
            {group.options.map((option) => {
              const checked = selectedFilters[group.title]?.has(option.value) ?? false
              return (
                <Label key={option.value} className="flex cursor-pointer items-center gap-2.5">
                  <Checkbox checked={checked} onCheckedChange={() => toggleFilter(group.title, option.value)} />
                  <Text as="span" className="text-pretty text-sm">
                    {option.label}
                  </Text>
                  {option.count != null && (
                    <Text as="span" className="text-tertiary text-sm">
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
      <Box className="flex flex-col gap-3">
        <Text className="cursor-default text-primary text-base font-medium">Цена, ₽</Text>
        <Box className="flex items-center gap-2">
          <Input
            type="text"
            placeholder={`от ${priceRange.min}`}
            className="border-border-default placeholder:text-input-placeholder
              focus:border-primary-500 h-10 w-full rounded-xl border px-3
              text-sm outline-none"
          />
          <Text as="span" className="text-disabled shrink-0">
            —
          </Text>
          <Input
            type="text"
            placeholder={`до ${priceRange.max.toLocaleString('ru-RU')}`}
            className="border-border-default placeholder:text-input-placeholder
              focus:border-primary-500 h-10 w-full rounded-xl border px-3
              text-sm outline-none"
          />
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
