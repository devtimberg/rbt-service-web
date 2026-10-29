'use client'

import { type ComponentType, type ReactNode, type SVGProps, useState } from 'react'
import {
  Box,
  Stack,
  Breadcrumb,
  Button,
  Checkbox,
  Chip,
  ConfirmDialog,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Dialog,
  Divider,
  Fieldset,
  Label,
  Legend,
  Output,
  Form,
  Heading,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Pagination,
  PhoneField,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
  LineBreak,
  Text,
  TextArea,
  TextField,
  TextInput,
  Tooltip,
} from '@/shared/ui'
import * as icons from '@/shared/ui'
import styles from './ui-kit-page.module.css'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box as="section" className={styles.section}>
      <Heading level={2} className={styles.sectionTitle}>
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
  const [kind, setKind] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <Box className={styles.page}>
      <Container className={styles.container}>
        <Heading level={1} size="xl">
          UI-кит
        </Heading>
        <Text className={styles.intro}>Примитивы shared/ui без Radix и cva: нативные dialog, input, CSS-анимации.</Text>

        <Section title="Box, Stack, Container">
          <Stack gap={4}>
            <Stack direction="row" gap={3} align="center" justify="between" wrap className={styles.card}>
              <Box className={styles.chipBox}>Box (div)</Box>
              <Box as="aside" className={styles.chipBox}>
                Box as="aside"
              </Box>
              <Box as="nav" aria-label="Пример" className={styles.chipBox}>
                Box as="nav"
              </Box>
            </Stack>
            <Stack gap={2} className={styles.card}>
              <Text>Stack column, gap 2</Text>
              <Text as="span">Text as="span"</Text>
              <Text as="s" className={styles.tertiary}>
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
            <Heading level={2} className={styles.mutedSm}>
              Без size: вид только из className
            </Heading>
          </Stack>
        </Section>

        <Section title="List, DescriptionList, Divider">
          <Stack gap={4} className={styles.maxMd}>
            <List className={styles.listDisc}>
              <ListItem>Маркированный список</ListItem>
              <ListItem>Второй пункт</ListItem>
            </List>
            <List as="ol" className={styles.listDecimal}>
              <ListItem>Нумерованный список</ListItem>
              <ListItem>Второй пункт</ListItem>
            </List>
            <Divider className={styles.divider} />
            <DescriptionList className={styles.descList}>
              <Box className={styles.descRow}>
                <DescriptionTerm className={styles.term}>Товары</DescriptionTerm>
                <DescriptionDetails className={styles.details}>1 000 ₽</DescriptionDetails>
              </Box>
              <Box className={styles.descRow}>
                <DescriptionTerm className={styles.term}>Доставка</DescriptionTerm>
                <DescriptionDetails className={styles.details}>Бесплатно</DescriptionDetails>
              </Box>
            </DescriptionList>
          </Stack>
        </Section>

        <Section title="Image">
          <Stack direction="row" gap={4} align="center" wrap>
            <Image src="/brand/logo.svg" alt="Логотип" width={180} height={40} className={styles.logo} />
            <Image
              src="/brand/logo.svg"
              alt="Логотип в picture"
              sources={[{ media: '(min-width: 768px)', srcSet: '/brand/logo.svg' }]}
              width={180}
              height={40}
              className={styles.logo}
            />
          </Stack>
        </Section>

        <Section title="Form, Label, Fieldset, Legend, Output, TextField">
          <Form onSubmit={(event) => event.preventDefault()} aria-label="Пример формы" className={styles.form}>
            <TextField label="Имя" name="ui-name" hint="TextField: подпись, поле и подсказка" />
            <TextField label="Email" name="ui-email" error="Введите корректный email" />
            <Box className={styles.field}>
              <Label htmlFor="ui-bare" className={styles.label}>
                Label + голый Input
              </Label>
              <Input id="ui-bare" className={styles.bareInput} />
            </Box>
            <Fieldset className={styles.fieldset}>
              <Legend className={styles.label}>Fieldset и Legend</Legend>
              <Label className={styles.checkLabel}>
                <Checkbox />
                Вариант
              </Label>
            </Fieldset>
            <Output className={styles.mutedSm}>Output: ничего не найдено</Output>
          </Form>
        </Section>

        <Section title="Select, PhoneField, TextArea, TextField (Figma «[C] Fluent Input»)">
          <Stack gap={4} className={styles.form}>
            <Select
              label="Вид техники"
              name="ui-kind"
              value={kind}
              options={[
                { value: 'cooktop', label: 'Варочная панель' },
                { value: 'fridge', label: 'Холодильник' },
              ]}
              onChange={(event) => setKind(event.target.value)}
            />
            <Select
              label="Select с ошибкой"
              name="ui-kind-error"
              value=""
              options={[]}
              error="Выберите технику"
              onChange={() => {}}
            />
            <Select
              label="Select disabled"
              name="ui-kind-disabled"
              value=""
              options={[]}
              disabled
              onChange={() => {}}
            />
            <PhoneField label="Номер телефона" name="ui-phone" value={phone} onValueChange={setPhone} />
            <PhoneField
              label="Телефон с ошибкой"
              name="ui-phone-error"
              value="900"
              onValueChange={() => {}}
              error="Введите номер полностью"
            />
            <TextField label="Заполненное поле" name="ui-filled" defaultValue="Текст" />
            <TextField label="Disabled" name="ui-disabled" disabled />
            <TextArea label="Комментарий к заявке" name="ui-comment" maxLength={255} />
            <TextArea
              label="TextArea с ошибкой"
              name="ui-comment-error"
              maxLength={255}
              defaultValue="Текст"
              error="Сообщение"
            />
          </Stack>
        </Section>

        <Section title="Button">
          <Stack gap={4}>
            <Stack direction="row" gap={3} className={styles.wrapCenter}>
              {(['default', 'primary', 'secondary', 'disabled', 'ghost', 'link', 'inverse', 'unstyled'] as const).map(
                (variant) => (
                  <Button key={variant} variant={variant}>
                    {variant}
                  </Button>
                ),
              )}
            </Stack>
            <Stack direction="row" gap={3} className={styles.wrapCenter}>
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
          <Stack direction="row" gap={3} className={styles.center}>
            <IconButton icon={icons.SearchIcon} variant="default" aria-label="Поиск" tooltip="Поиск" />
            <IconButton icon={icons.BagIcon} variant="filled" counter={3} aria-label="Корзина" />
            <IconButton icon={icons.HeartIcon} variant="ghost" counter={120} aria-label="Избранное" />
            <Box className={styles.darkBox}>
              <IconButton icon={icons.CloseIcon} variant="inverse" aria-label="Закрыть" />
            </Box>
            <Tooltip content="Подсказка сверху" side="top">
              <Button variant="secondary">Наведите</Button>
            </Tooltip>
          </Stack>
        </Section>

        <Section title="Chip">
          <Stack direction="row" gap={2} className={styles.wrap}>
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
          <Stack direction="row" gap={12} className={styles.wrap}>
            <Stack gap={3}>
              <Label className={styles.checkLabel}>
                <Checkbox checked={checked} onCheckedChange={(next) => setChecked(next)} />
                Контролируемый ({String(checked)})
              </Label>
              <Label className={styles.checkLabel}>
                <Checkbox defaultChecked />
                Отмечен по умолчанию
              </Label>
              <Label className={styles.checkLabel}>
                <Checkbox disabled />
                Disabled
              </Label>
            </Stack>
            <RadioGroup value={radio} onValueChange={setRadio} className={styles.radioGroup}>
              {['all', 'stock', 'order'].map((value) => (
                <Label key={value} className={styles.checkLabel}>
                  <RadioGroupItem value={value} />
                  {value}
                </Label>
              ))}
            </RadioGroup>
          </Stack>
        </Section>

        <Section title="TextInput, Text, Heading, Skeleton">
          <Stack gap={3} className={styles.maxMd}>
            <TextInput placeholder="Обычное поле" />
            <TextInput placeholder="Невалидное" aria-invalid defaultValue="oops" />
            <TextInput placeholder="Disabled" disabled />
            <Text className={styles.errorText}>Текст ошибки</Text>
            <Heading level={2} size="lg">
              Заголовок lg
            </Heading>
            <Skeleton className={styles.skeleton} />
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
              <Box className={styles.sheetBody}>Содержимое шторки</Box>
              <SheetFooter>
                <Button onClick={() => setSheet(false)}>Готово</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="ScrollArea">
          <ScrollArea className={styles.scroll} viewportClassName={styles.scrollViewport}>
            {Array.from({ length: 20 }, (_, i) => (
              <Text key={i} className={styles.scrollRow}>
                Строка {i + 1}
              </Text>
            ))}
          </ScrollArea>
        </Section>

        <Section title="Иконки (SVGR)">
          <Stack direction="row" gap={4} className={styles.icons}>
            {/* Порядок ключей namespace на сервере и в браузере может отличаться: сортируем, иначе гидрация падает */}
            {(
              Object.entries(icons).filter(([name]) => name.endsWith('Icon')) as [
                string,
                ComponentType<SVGProps<SVGSVGElement>>,
              ][]
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, Icon]) => (
                <Stack key={name} className={styles.iconCell}>
                  <Icon className={styles.icon} />
                  <Text as="span" className={styles.iconName}>
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
