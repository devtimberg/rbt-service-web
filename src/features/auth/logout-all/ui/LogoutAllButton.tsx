import { useState } from 'react'
import { resultMessage } from '@/entities/session'
import { Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { FormAlert } from '@/shared/ui/FormAlert'
import { useLogoutAll } from '../model/useLogoutAll'

export function LogoutAllButton() {
  const { mutate, isPending, data, error } = useLogoutAll()
  const [confirmOpen, setConfirmOpen] = useState(false)
  return (
    <Stack gap={3}>
      <FormAlert message={resultMessage(data, error)} />
      <Button variant="secondary" size="full" className="h-12" loading={isPending} onClick={() => setConfirmOpen(true)}>
        Выйти со всех устройств
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Выйти со всех устройств?"
        description="Вы выйдете на всех устройствах, включая это. Чтобы продолжить, нужно будет войти заново."
        confirmLabel="Выйти везде"
        onConfirm={() => mutate()}
      />
    </Stack>
  )
}
