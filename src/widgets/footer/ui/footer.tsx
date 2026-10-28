'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { useIsMobile } from '@/shared/lib/use-media-query'
import {
  Box,
  Stack,
  Button,
  Container,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from '@/shared/ui'
import { WorkingHoursContent } from './working-hours-content'
import styles from './footer.module.css'

const GREETINGS = ['Добро пожаловать', 'Welcome', 'ようこそ', '欢迎']
const LONGEST_GREETING = GREETINGS.reduce((longest, current) => (current.length > longest.length ? current : longest))

type FooterProps = {
  variant?: 'default' | 'inverse'
}

export function Footer({ variant = 'inverse' }: FooterProps) {
  const isInverse = variant === 'inverse'
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [typedLength, setTypedLength] = useState(0)

  useEffect(() => {
    const currentGreeting = GREETINGS[greetingIndex] ?? ''
    let timer: ReturnType<typeof setTimeout>

    if (typedLength < currentGreeting.length) {
      timer = setTimeout(() => {
        setTypedLength((prev) => prev + 1)
      }, 110)
    } else {
      timer = setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETINGS.length)
        setTypedLength(0)
      }, 1700)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [greetingIndex, typedLength])

  return (
    <Container className={styles.root}>
      <Stack direction="row" className={styles.row}>
        <Text className={cn(styles.copyright, isInverse ? styles.inverse : styles.tertiary)}>
          {`© 1995 — 2026 ТТЦ Рембыттехника.\nВсе права защищены. Условия использования. Политика конфиденциальности.\nАдрес: г. Челябинск, ул. Производственная д. 8Б, Тел.: +7(351)239-39-39 Email: service@rbt.ru`}
        </Text>
        <Stack direction="row" align="center" justify="center" className={styles.hours} gap={4}>
          <Text className={styles.greeting}>
            <Text as="span" className={styles.sizer}>
              {LONGEST_GREETING}
              <Text as="span" aria-hidden className={styles.caret}>
                |
              </Text>
            </Text>
            <Text as="span" className={cn(styles.typed, isInverse ? styles.inverse : styles.primary)}>
              {(GREETINGS[greetingIndex] ?? '').slice(0, typedLength)}
              <Text as="span" aria-hidden className={cn(styles.caret, styles.caretPulse)}>
                |
              </Text>
            </Text>
          </Text>
          <Box>
            {isMobile ? (
              <>
                <Button variant={isInverse ? 'inverse' : 'secondary'} size="lg" onClick={() => setOpen(true)}>
                  Время работы
                </Button>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Время работы</SheetTitle>
                    </SheetHeader>
                    <Box className={styles.sheetBody}>
                      <WorkingHoursContent />
                    </Box>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                  <Button variant={isInverse ? 'inverse' : 'secondary'} size="lg">
                    Время работы
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" sideOffset={16} className={styles.popover}>
                  <WorkingHoursContent />
                </PopoverContent>
              </Popover>
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  )
}
