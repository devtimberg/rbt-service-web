'use client'

import { useId } from 'react'
import { ROUTES, SUPPORT_PHONE, SUPPORT_PHONE_HREF } from '@/shared/config'
import {
  Button,
  CloseIcon,
  DialogShell,
  Heading,
  IconButton,
  LineBreak,
  LockFilledIcon,
  SmartLink,
  Text,
} from '@/shared/ui'
import { isLockedSection } from '../model'
import styles from './locked-section-dialog.module.css'

type LockedSectionDialogProps = {
  open: boolean
  onClose: () => void
}

/**
 * Окно «Этот раздел ещё в работе» (Figma «Модал — Этот раздел ещё в работе», шторка в «Главная (Mobile) — MVP»):
 * ниже md шторка снизу, от md окно 520 по центру. Ведёт в открытые разделы и предлагает позвонить.
 * Кнопки-ссылки закрывают окно: шапка и навигация, где оно живёт, при переходе не размонтируются.
 */
export function LockedSectionDialog({ open, onClose }: LockedSectionDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      placement="responsive"
      className={styles.root}
    >
      <IconButton
        variant="ghost"
        size="sm"
        icon={CloseIcon}
        aria-label="Закрыть"
        onClick={onClose}
        className={styles.close}
      />
      <LockFilledIcon aria-hidden className={styles.icon} />
      <Heading level={2} id={titleId} className={styles.title}>
        Этот раздел ещё в работе
      </Heading>
      <Text id={descriptionId} className={styles.description}>
        Мы запускаем сервис по частям, чтобы быстрее начать помогать. Сейчас можно вызвать мастера и заказать запчасть —
        остальное появится
        <LineBreak />в ближайших обновлениях
      </Text>
      <Button href={ROUTES.MASTER_CALL} variant="primary" className={styles.action} onClick={onClose}>
        Вызвать мастера
      </Button>
      {isLockedSection(ROUTES.PARTS_REQUEST) ? null : (
        <Button href={ROUTES.PARTS_REQUEST} variant="outline" className={styles.action} onClick={onClose}>
          Заказать запчасть
        </Button>
      )}
      <Text className={styles.call}>
        Или позвоните:{' '}
        <SmartLink href={SUPPORT_PHONE_HREF} className={styles.phone}>
          {SUPPORT_PHONE}
        </SmartLink>{' '}
        — бесплатно
      </Text>
    </DialogShell>
  )
}
