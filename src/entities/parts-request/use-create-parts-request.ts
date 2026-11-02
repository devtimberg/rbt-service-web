'use client'

// Хук живёт отдельно от api.ts: модуль с React-хуком не должен попадать в серверный граф Next
// (AGENTS.md, «API (RTK Query)»).
import { partsRequestApi } from './api'

export const { useCreatePartsRequestMutation } = partsRequestApi
