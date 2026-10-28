import { useEffect, useState } from 'react'
import { useIsMobile } from '@/shared/lib/useMediaQuery'
import { Box, Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/Sheet'
import { Text } from '@/shared/ui/Text'
import { WorkingHoursContent } from './WorkingHoursContent'

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
    <Container className="mt-auto max-md:px-4 pt-8 pb-4 sm:pt-20 lg:pb-[clamp(12px,2.5vh,24px)]">
      <Stack
        direction="row"
        className="xs:gap-10 flex-col-reverse items-center justify-center gap-4
          md:flex-row md:items-end md:justify-between"
      >
        <Text
          className={`cursor-default font-normal text-xs min-w-0 flex-1 text-center leading-4 whitespace-pre-wrap
            md:text-left ${isInverse ? 'text-inverse' : 'text-tertiary'}`}
        >
          {`© 1995 — 2026 ТТЦ Рембыттехника.\nВсе права защищены. Условия использования. Политика конфиденциальности.\nАдрес: г. Челябинск, ул. Производственная д. 8Б, Тел.: +7(351)239-39-39 Email: service@rbt.ru`}
        </Text>
        <Stack direction="row" className="w-85 shrink-0 items-center justify-center md:justify-end" gap={4}>
          <Text className="cursor-default text-primary relative shrink-0 text-center text-[18px] leading-5 font-semibold whitespace-nowrap md:text-right">
            <Text as="span" className="invisible">
              {LONGEST_GREETING}
              <Text as="span" aria-hidden className="ml-0.5 inline-block">
                |
              </Text>
            </Text>
            <Text
              as="span"
              className={`absolute inset-0
                ${isInverse ? 'text-inverse' : 'text-primary'}`}
            >
              {(GREETINGS[greetingIndex] ?? '').slice(0, typedLength)}
              <Text
                as="span"
                aria-hidden
                className="animation-duration-[450ms] ml-0.5 inline-block
                  motion-safe:animate-pulse"
              >
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
                    <Box className="px-4 pb-6">
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
                <PopoverContent side="top" align="end" sideOffset={16} className="w-auto border-none p-10">
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
