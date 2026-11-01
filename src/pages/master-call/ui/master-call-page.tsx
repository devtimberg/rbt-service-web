'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { MasterCall } from '@/entities/master-call'
import { Container } from '@/shared/ui'
import type { MasterCallFormValues } from '../model/schema'
import { MasterCallCreated } from './master-call-created'
import { MasterCallForm } from './master-call-form'
import { ReceiptPrinter } from './receipt-printer'
import styles from './master-call-page.module.css'

export function MasterCallPage() {
  const root = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Partial<MasterCallFormValues>>({})
  const [created, setCreated] = useState<{ call: MasterCall; values: MasterCallFormValues } | null>(null)

  useLayoutEffect(() => {
    if (!created) return
    const viewport = root.current?.closest('[data-sheet-scroll]')?.firstElementChild
    if (viewport) viewport.scrollTop = 0
  }, [created])

  return (
    <Container className={styles.root} ref={root}>
      {created ? (
        <MasterCallCreated call={created.call} />
      ) : (
        <MasterCallForm
          valuesAction={setValues}
          createdAction={(call, submitted) => setCreated({ call, values: submitted })}
        />
      )}
      <ReceiptPrinter values={created?.values ?? values} call={created?.call} />
    </Container>
  )
}
