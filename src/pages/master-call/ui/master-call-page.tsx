'use client'

import { useState } from 'react'
import type { MasterCall } from '@/entities/master-call'
import type { MasterCallFormValues } from '../model/schema'
import { MasterCallCreated } from './master-call-created'
import { MasterCallForm } from './master-call-form'

export function MasterCallPage() {
  const [created, setCreated] = useState<{ call: MasterCall; values: MasterCallFormValues } | null>(null)

  if (created) return <MasterCallCreated {...created} />
  return <MasterCallForm createdAction={(call, values) => setCreated({ call, values })} />
}
