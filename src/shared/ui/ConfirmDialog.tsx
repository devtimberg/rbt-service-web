import { Button } from './Button'
import { Dialog } from './Dialog'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
}

/** Подтверждение действия: шторка снизу ниже md и окно по центру от md. Закрывается после подтверждения. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  onConfirm,
}: ConfirmDialogProps) {
  function handleConfirm() {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      {...(description ? { description } : {})}
      placement="responsive"
      footer={
        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <Button variant="primary" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
        </div>
      }
    />
  )
}
