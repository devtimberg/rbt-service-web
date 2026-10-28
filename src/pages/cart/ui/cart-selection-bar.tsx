'use client'

import { useState } from 'react'
import { Box, Button, Checkbox, ConfirmDialog, Label, IconButton, DeleteIcon, ShareIcon, Text } from '@/shared/ui'
import styles from './cart-selection-bar.module.css'

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
    <Box className={styles.root}>
      {/* Left: select all */}
      <Label className={styles.selectAll}>
        <Checkbox checked={checked} onCheckedChange={() => (allSelected ? onDeselectAll() : onSelectAll())} />
        <Text className={styles.selectAllText}>Выбрать все</Text>
      </Label>

      {/* Right: share + delete */}
      <Box className={styles.actions}>
        <Button
          variant="secondary"
          size="sm"
          icon={<ShareIcon className={styles.shareIcon} />}
          onClick={onShareSelected}
          disabled={selectedCount === 0}
          className={styles.shareButton}
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
          className={styles.deleteButton}
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
