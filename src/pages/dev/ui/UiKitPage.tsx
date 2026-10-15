import { type ReactNode, useState } from 'react'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Chip } from '@/shared/ui/Chip'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Container } from '@/shared/ui/Container'
import { Dialog } from '@/shared/ui/Dialog'
import { Heading } from '@/shared/ui/Heading'
import { HStack } from '@/shared/ui/HStack'
import { IconButton } from '@/shared/ui/IconButton'
import * as icons from '@/shared/ui/icons'
import { Input } from '@/shared/ui/Input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/Pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/RadioGroup'
import { ScrollArea } from '@/shared/ui/ScrollArea'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/shared/ui/Sheet'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Text } from '@/shared/ui/Text'
import { Tooltip } from '@/shared/ui/Tooltip'
import { VStack } from '@/shared/ui/VStack'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border-default py-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

/** Витрина примитивов shared/ui (только dev, маршрут /_dev/ui). */
export function UiKitPage() {
  const [dialog, setDialog] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate')
  const [radio, setRadio] = useState('all')
  const [chip, setChip] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="mt-6 flex-1 rounded-t-[24px] bg-[#F7FAFF] text-primary lg:rounded-[40px]">
      <Container className="px-4 py-8">
        <Heading size="xl">UI-кит</Heading>
        <Text size="sm" variant="secondary" className="mt-2">
          Примитивы shared/ui без Radix и cva: нативные dialog, input, CSS-анимации.
        </Text>

        <Section title="Button">
          <VStack gap={4}>
            <HStack gap={3} className="flex-wrap items-center">
              {(['default', 'primary', 'secondary', 'disabled', 'ghost', 'link', 'inverse'] as const).map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </HStack>
            <HStack gap={3} className="flex-wrap items-center">
              {(['xs', 'sm', 'md', 'lg', 'iconRight'] as const).map((size) => (
                <Button key={size} size={size} variant="secondary">
                  {size}
                </Button>
              ))}
              <Button rounded="full">full</Button>
              <Button disabled>Disabled</Button>
              <Button
                loading={loading}
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 1500)
                }}
              >
                Loading
              </Button>
              <Button href="/" variant="secondary">
                Ссылка (href)
              </Button>
            </HStack>
          </VStack>
        </Section>

        <Section title="IconButton и Tooltip">
          <HStack gap={3} className="items-center">
            <IconButton icon={icons.SearchIcon} variant="default" aria-label="Поиск" tooltip="Поиск" />
            <IconButton icon={icons.BagIcon} variant="filled" counter={3} aria-label="Корзина" />
            <IconButton icon={icons.HeartIcon} variant="ghost" counter={120} aria-label="Избранное" />
            <Box className="rounded-lg bg-primary-900 p-1">
              <IconButton icon={icons.CloseIcon} variant="inverse" aria-label="Закрыть" />
            </Box>
            <Tooltip content="Подсказка сверху" side="top">
              <Button variant="secondary">Наведите</Button>
            </Tooltip>
          </HStack>
        </Section>

        <Section title="Chip">
          <HStack gap={2} className="flex-wrap">
            <Chip>default</Chip>
            <Chip selected>selected</Chip>
            <Chip variant="outline-default">outline</Chip>
            <Chip variant="outline-default" selected>
              outline selected
            </Chip>
            <Chip rounded="md" size="lg" selected={chip} onClick={() => setChip((v) => !v)}>
              Переключатель
            </Chip>
          </HStack>
        </Section>

        <Section title="Checkbox и RadioGroup">
          <HStack gap={12} className="flex-wrap">
            <VStack gap={3}>
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox checked={checked} onCheckedChange={(next) => setChecked(next)} />
                Контролируемый ({String(checked)})
              </label>
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox defaultChecked />
                Отмечен по умолчанию
              </label>
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox disabled />
                Disabled
              </label>
            </VStack>
            <RadioGroup value={radio} onValueChange={setRadio} className="gap-2.5">
              {['all', 'stock', 'order'].map((value) => (
                <label key={value} className="flex items-center gap-2.5 text-sm">
                  <RadioGroupItem value={value} />
                  {value}
                </label>
              ))}
            </RadioGroup>
          </HStack>
        </Section>

        <Section title="Input, Text, Heading, Skeleton">
          <VStack gap={3} className="max-w-md">
            <Input placeholder="Обычное поле" />
            <Input placeholder="Невалидное" aria-invalid defaultValue="oops" />
            <Input placeholder="Disabled" disabled />
            <Text variant="error" size="sm">
              Текст ошибки
            </Text>
            <Heading size="lg">Заголовок lg</Heading>
            <Skeleton className="h-8 w-48" />
          </VStack>
        </Section>

        <Section title="Breadcrumb и Pagination">
          <VStack gap={4}>
            <Breadcrumb items={[{ label: 'Каталог', href: '/' }, { label: 'Запчасти' }]} />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </VStack>
        </Section>

        <Section title="Popover">
          <HStack gap={4}>
            <Popover>
              <PopoverTrigger>
                <Button variant="secondary">Снизу</Button>
              </PopoverTrigger>
              <PopoverContent align="start">Содержимое поповера</PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Button variant="secondary">Сверху, справа</Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="end" sideOffset={12}>
                Закрывается Esc и тапом снаружи
              </PopoverContent>
            </Popover>
          </HStack>
        </Section>

        <Section title="Dialog, ConfirmDialog, Sheet">
          <HStack gap={3}>
            <Button variant="secondary" onClick={() => setDialog(true)}>
              Dialog
            </Button>
            <Button variant="secondary" onClick={() => setConfirm(true)}>
              ConfirmDialog
            </Button>
            <Button variant="secondary" onClick={() => setSheet(true)}>
              Sheet
            </Button>
          </HStack>
          <Dialog open={dialog} onClose={() => setDialog(false)} title="Диалог" description="Нативный dialog">
            Esc и клик по затемнению закрывают окно.
          </Dialog>
          <ConfirmDialog
            open={confirm}
            onOpenChange={setConfirm}
            title="Удалить товар?"
            description="Это действие нельзя отменить."
            onConfirm={() => {}}
          />
          <Sheet open={sheet} onOpenChange={setSheet}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Шторка</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">Содержимое шторки</div>
              <SheetFooter>
                <Button onClick={() => setSheet(false)}>Готово</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="ScrollArea">
          <ScrollArea className="h-40 w-64 rounded-lg border border-border-default" viewportClassName="p-3">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="py-1 text-sm">
                Строка {i + 1}
              </p>
            ))}
          </ScrollArea>
        </Section>

        <Section title="Иконки (SVGR)">
          <HStack gap={4} className="flex-wrap text-primary-500">
            {/* Порядок ключей namespace на сервере и в браузере может отличаться: сортируем, иначе гидрация падает */}
            {Object.entries(icons)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, Icon]) => (
                <VStack key={name} className="w-24 items-center gap-1 text-center">
                  <Icon className="size-8" />
                  <span className="text-[10px] text-tertiary">{name}</span>
                </VStack>
              ))}
          </HStack>
        </Section>
      </Container>
    </div>
  )
}
