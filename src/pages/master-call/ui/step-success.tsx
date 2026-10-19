import { useRouter } from '@tanstack/react-router'
import { ROUTES } from '@/shared/config'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { CheckIcon } from '@/shared/ui/icons'
import { SheetFooterSlot } from '@/shared/ui/SheetFooterSlot'
import { Text } from '@/shared/ui/Text'

export function StepSuccess() {
  const router = useRouter()

  const handleClose = () => {
    // Флаг history.state.sheet в старом коде нигде не выставлялся, поэтому всегда переходим на главную
    void router.navigate({ to: ROUTES.HOME })
  }

  return (
    <Container className="flex flex-col gap-8">
      <Breadcrumb items={[{ label: 'Сервис', href: '/' }, { label: 'Вызвать мастера' }]} />

      <Heading level={1} size="xl" className="hidden sm:block">
        Вызвать мастера
      </Heading>

      <Box className="flex items-center gap-3">
        <Box className="rounded-xl bg-green-600 p-1">
          <CheckIcon className="text-3xl text-white" />
        </Box>
        <Heading level={2} size="lg">
          Заявка подтверждена
        </Heading>
      </Box>

      <Heading level={3} size="md">
        # 321-587-15
      </Heading>

      <Text className="cursor-default font-normal text-secondary text-base max-w-120">
        Спасибо что обратились в наш сервис, в ближайшее время с вами свяжется наш менеджер и уточнит детали
      </Text>

      <SheetFooterSlot contentClassName="justify-end">
        <Button className="w-full sm:w-auto" onClick={handleClose}>
          Хорошо
        </Button>
      </SheetFooterSlot>
    </Container>
  )
}
