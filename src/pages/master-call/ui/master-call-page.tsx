'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
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
  const [hasError, setHasError] = useState(false)
  const [activity, setActivity] = useState(0)
  const signalActivity = useCallback(() => setActivity((previous) => previous + 1), [])
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
          errorAction={setHasError}
          activityAction={signalActivity}
          createdAction={(call, submitted) => setCreated({ call, values: submitted })}
        />
      )}
      <ReceiptPrinter values={created?.values ?? values} call={created?.call} hasError={hasError} activity={activity} />
    </Container>
  )
}
