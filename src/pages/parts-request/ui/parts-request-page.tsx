'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { PartsRequest } from '@/entities/parts-request'
import { Container } from '@/shared/ui'
import type { PartsRequestFormValues } from '../model/schema'
import { PartsRequestCreated } from './parts-request-created'
import { PartsRequestForm } from './parts-request-form'
import { ReceiptPrinter } from './receipt-printer'
import styles from './parts-request-page.module.css'

export function PartsRequestPage() {
  const root = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Partial<PartsRequestFormValues>>({})
  const [hasError, setHasError] = useState(false)
  const [activity, setActivity] = useState(0)
  const signalActivity = useCallback(() => setActivity((previous) => previous + 1), [])
  const [created, setCreated] = useState<{ call: PartsRequest; values: PartsRequestFormValues } | null>(null)

  useLayoutEffect(() => {
    if (!created) return
    const viewport = root.current?.closest('[data-sheet-scroll]')?.firstElementChild
    if (viewport) viewport.scrollTop = 0
  }, [created])

  return (
    <Container className={styles.root} ref={root}>
      {created ? (
        <PartsRequestCreated call={created.call} />
      ) : (
        <PartsRequestForm
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
