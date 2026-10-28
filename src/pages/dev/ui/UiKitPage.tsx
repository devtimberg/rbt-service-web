import { type ReactNode, useState } from 'react'
import { Box, Stack } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Chip } from '@/shared/ui/Chip'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Container } from '@/shared/ui/Container'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/ui/DescriptionList'
import { Dialog } from '@/shared/ui/Dialog'
import { Divider } from '@/shared/ui/Divider'
import { Fieldset, Label, Legend, Output } from '@/shared/ui/Field'
import { Form } from '@/shared/ui/Form'
import { Heading } from '@/shared/ui/Heading'
import { IconButton } from '@/shared/ui/IconButton'
import * as icons from '@/shared/ui/icons'
import { Image } from '@/shared/ui/Image'
import { Input } from '@/shared/ui/Input'
import { List, ListItem } from '@/shared/ui/List'
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
import { LineBreak, Text } from '@/shared/ui/Text'
import { TextField } from '@/shared/ui/TextField'
import { TextInput } from '@/shared/ui/TextInput'
import { Tooltip } from '@/shared/ui/Tooltip'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box as="section" className="border-t border-border-default py-8">
      <Heading level={2} className="mb-4 text-xl font-semibold">
        {title}
      </Heading>
      {children}
    </Box>
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
    <Box className="mt-6 flex-1 rounded-t-[24px] bg-[#F7FAFF] text-primary lg:rounded-[40px]">
      <Container className="max-md:px-4 py-8">
        <Heading level={1} size="xl">
          UI-кит
        </Heading>
        <Text className="cursor-default font-normal text-secondary text-sm mt-2">
          Примитивы shared/ui без Radix и cva: нативные dialog, input, CSS-анимации.
        </Text>

        <Section title="Box, Stack, Container">
          <Stack gap={4}>
            <Stack direction="row" gap={3} align="center" justify="between" wrap className="rounded-lg bg-white p-3">
              <Box className="rounded-md bg-primary-100/20 px-3 py-1">Box (div)</Box>
              <Box as="aside" className="rounded-md bg-primary-100/20 px-3 py-1">
                Box as="aside"
              </Box>
              <Box as="nav" aria-label="Пример" className="rounded-md bg-primary-100/20 px-3 py-1">
                Box as="nav"
              </Box>
            </Stack>
            <Stack gap={2} className="rounded-lg bg-white p-3">
              <Text>Stack column, gap 2</Text>
              <Text as="span">Text as="span"</Text>
              <Text as="s" className="text-tertiary">
                Text as="s" (старая цена)
              </Text>
              <Text>
                Адрес:
                <LineBreak />
                перенос строки LineBreak
              </Text>
            </Stack>
          </Stack>
        </Section>

        <Section title="Heading (level и size)">
          <Stack gap={2}>
            {(
              [
                [1, 'xl'],
                [2, 'lg'],
                [3, 'md'],
                [4, 'sm'],
                [5, 'xs'],
              ] as const
            ).map(([level, size]) => (
              <Heading key={level} level={level} size={size}>
                level {level}, size {size}
              </Heading>
            ))}
            <Heading level={2} className="text-sm text-tertiary">
              Без size: вид только из className
            </Heading>
          </Stack>
        </Section>

        <Section title="List, DescriptionList, Divider">
          <Stack gap={4} className="max-w-md">
            <List className="list-disc pl-5 text-sm">
              <ListItem>Маркированный список</ListItem>
              <ListItem>Второй пункт</ListItem>
            </List>
            <List as="ol" className="list-decimal pl-5 text-sm">
              <ListItem>Нумерованный список</ListItem>
              <ListItem>Второй пункт</ListItem>
            </List>
            <Divider className="border-border-default" />
            <DescriptionList className="flex flex-col gap-2 text-sm">
              <Box className="flex justify-between">
                <DescriptionTerm className="text-secondary">Товары</DescriptionTerm>
                <DescriptionDetails className="font-medium">1 000 ₽</DescriptionDetails>
              </Box>
              <Box className="flex justify-between">
                <DescriptionTerm className="text-secondary">Доставка</DescriptionTerm>
                <DescriptionDetails className="font-medium">Бесплатно</DescriptionDetails>
              </Box>
            </DescriptionList>
          </Stack>
        </Section>

        <Section title="Image">
          <Stack direction="row" gap={4} align="center" wrap>
            <Image src="/brand/logo.svg" alt="Логотип" width={180} height={40} className="h-10 w-45 bg-primary-500" />
            <Image
              src="/brand/logo.svg"
              alt="Логотип в picture"
              sources={[{ media: '(min-width: 768px)', srcSet: '/brand/logo.svg' }]}
              width={180}
              height={40}
              className="h-10 w-45 bg-primary-500"
            />
          </Stack>
        </Section>

        <Section title="Form, Label, Fieldset, Legend, Output, TextField">
          <Form
            onSubmit={(event) => event.preventDefault()}
            aria-label="Пример формы"
            className="flex max-w-md flex-col gap-4"
          >
            <TextField label="Имя" name="ui-name" hint="TextField: подпись, поле и подсказка" />
            <TextField label="Email" name="ui-email" error="Введите корректный email" />
            <Box className="flex flex-col gap-1.5">
              <Label htmlFor="ui-bare" className="text-sm font-medium text-secondary">
                Label + голый Input
              </Label>
              <Input id="ui-bare" className="h-10 rounded-lg border border-border-default px-3" />
            </Box>
            <Fieldset className="flex flex-col gap-2">
              <Legend className="text-sm font-medium text-secondary">Fieldset и Legend</Legend>
              <Label className="flex items-center gap-2.5 text-sm">
                <Checkbox />
                Вариант
              </Label>
            </Fieldset>
            <Output className="text-sm text-tertiary">Output: ничего не найдено</Output>
          </Form>
        </Section>

        <Section title="Button">
          <Stack gap={4}>
            <Stack direction="row" gap={3} className="flex-wrap items-center">
              {(['default', 'primary', 'secondary', 'disabled', 'ghost', 'link', 'inverse', 'unstyled'] as const).map(
                (variant) => (
                  <Button key={variant} variant={variant}>
                    {variant}
                  </Button>
                ),
              )}
            </Stack>
            <Stack direction="row" gap={3} className="flex-wrap items-center">
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
            </Stack>
          </Stack>
        </Section>

        <Section title="IconButton и Tooltip">
          <Stack direction="row" gap={3} className="items-center">
            <IconButton icon={icons.SearchIcon} variant="default" aria-label="Поиск" tooltip="Поиск" />
            <IconButton icon={icons.BagIcon} variant="filled" counter={3} aria-label="Корзина" />
            <IconButton icon={icons.HeartIcon} variant="ghost" counter={120} aria-label="Избранное" />
            <Box className="rounded-lg bg-primary-900 p-1">
              <IconButton icon={icons.CloseIcon} variant="inverse" aria-label="Закрыть" />
            </Box>
            <Tooltip content="Подсказка сверху" side="top">
              <Button variant="secondary">Наведите</Button>
            </Tooltip>
          </Stack>
        </Section>

        <Section title="Chip">
          <Stack direction="row" gap={2} className="flex-wrap">
            <Chip>default</Chip>
            <Chip selected>selected</Chip>
            <Chip variant="outline-default">outline</Chip>
            <Chip variant="outline-default" selected>
              outline selected
            </Chip>
            <Chip rounded="md" size="lg" selected={chip} onClick={() => setChip((v) => !v)}>
              Переключатель
            </Chip>
          </Stack>
        </Section>

        <Section title="Checkbox и RadioGroup">
          <Stack direction="row" gap={12} className="flex-wrap">
            <Stack gap={3}>
              <Label className="flex items-center gap-2.5 text-sm">
                <Checkbox checked={checked} onCheckedChange={(next) => setChecked(next)} />
                Контролируемый ({String(checked)})
              </Label>
              <Label className="flex items-center gap-2.5 text-sm">
                <Checkbox defaultChecked />
                Отмечен по умолчанию
              </Label>
              <Label className="flex items-center gap-2.5 text-sm">
                <Checkbox disabled />
                Disabled
              </Label>
            </Stack>
            <RadioGroup value={radio} onValueChange={setRadio} className="gap-2.5">
              {['all', 'stock', 'order'].map((value) => (
                <Label key={value} className="flex items-center gap-2.5 text-sm">
                  <RadioGroupItem value={value} />
                  {value}
                </Label>
              ))}
            </RadioGroup>
          </Stack>
        </Section>

        <Section title="TextInput, Text, Heading, Skeleton">
          <Stack gap={3} className="max-w-md">
            <TextInput placeholder="Обычное поле" />
            <TextInput placeholder="Невалидное" aria-invalid defaultValue="oops" />
            <TextInput placeholder="Disabled" disabled />
            <Text className="cursor-default font-normal text-input-error-message leading-5! text-sm">Текст ошибки</Text>
            <Heading level={2} size="lg">
              Заголовок lg
            </Heading>
            <Skeleton className="h-8 w-48" />
          </Stack>
        </Section>

        <Section title="Breadcrumb и Pagination">
          <Stack gap={4}>
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
          </Stack>
        </Section>

        <Section title="Popover">
          <Stack direction="row" gap={4}>
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
          </Stack>
        </Section>

        <Section title="Dialog, ConfirmDialog, Sheet">
          <Stack direction="row" gap={3}>
            <Button variant="secondary" onClick={() => setDialog(true)}>
              Dialog
            </Button>
            <Button variant="secondary" onClick={() => setConfirm(true)}>
              ConfirmDialog
            </Button>
            <Button variant="secondary" onClick={() => setSheet(true)}>
              Sheet
            </Button>
          </Stack>
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
              <Box className="px-4 pb-6">Содержимое шторки</Box>
              <SheetFooter>
                <Button onClick={() => setSheet(false)}>Готово</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="ScrollArea">
          <ScrollArea className="h-40 w-64 rounded-lg border border-border-default" viewportClassName="p-3">
            {Array.from({ length: 20 }, (_, i) => (
              <Text key={i} className="py-1 text-sm">
                Строка {i + 1}
              </Text>
            ))}
          </ScrollArea>
        </Section>

        <Section title="Иконки (SVGR)">
          <Stack direction="row" gap={4} className="flex-wrap text-primary-500">
            {/* Порядок ключей namespace на сервере и в браузере может отличаться: сортируем, иначе гидрация падает */}
            {Object.entries(icons)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, Icon]) => (
                <Stack key={name} className="w-24 items-center gap-1 text-center">
                  <Icon className="size-8" />
                  <Text as="span" className="text-[10px] text-tertiary">
                    {name}
                  </Text>
                </Stack>
              ))}
          </Stack>
        </Section>
      </Container>
    </Box>
  )
}
