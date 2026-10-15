import { useState } from 'react'
import { Box } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { Label } from '@/shared/ui/Field'
import { IconButton } from '@/shared/ui/IconButton'
import { DeleteIcon, ShareIcon } from '@/shared/ui/icons'
import { Text } from '@/shared/ui/Text'

type CartSelectionBarProps = {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onDeleteSelected: () => void
  onShareSelected: () => void
}

export function CartSelectionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onShareSelected,
}: CartSelectionBarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const allSelected = selectedCount === totalCount
  const someSelected = selectedCount > 0 && !allSelected

  const checked = allSelected ? true : someSelected ? 'indeterminate' : false

  return (
    <Box
      className="flex items-center justify-between rounded-2xl bg-white px-4
        py-3"
    >
      {/* Left: select all */}
      <Label className="flex cursor-pointer items-center gap-3">
        <Checkbox checked={checked} onCheckedChange={() => (allSelected ? onDeselectAll() : onSelectAll())} />
        <Text className="cursor-default text-primary text-sm font-medium">Выбрать все</Text>
      </Label>

      {/* Right: share + delete */}
      <Box className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<ShareIcon className="size-5" />}
          onClick={onShareSelected}
          disabled={selectedCount === 0}
          className="text-tertiary gap-1.5 font-medium disabled:cursor-default
            disabled:opacity-40"
        >
          Поделиться
        </Button>
        <IconButton
          variant="default"
          size="md"
          icon={DeleteIcon}
          iconSize={20}
          onClick={() => setShowDeleteConfirm(true)}
          disabled={selectedCount === 0}
          className="shrink-0 rounded-lg disabled:cursor-default
            disabled:opacity-40"
        />
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title={`Удалить ${selectedCount === totalCount ? 'все товары' : 'выбранные товары'}?`}
          description={`Будет удалено: ${selectedCount}`}
          confirmLabel="Удалить"
          onConfirm={onDeleteSelected}
        />
      </Box>
    </Box>
  )
}
