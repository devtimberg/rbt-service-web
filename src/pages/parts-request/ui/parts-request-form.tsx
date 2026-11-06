'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useCreatePartsRequestMutation, type PartsRequest } from '@/entities/parts-request'
import { type QueryError } from '@/shared/api'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { useNavigationBlocker } from '@/shared/lib/navigation-guard'
import {
  Box,
  Breadcrumb,
  Button,
  Form,
  FormAlert,
  Heading,
  PhoneField,
  SheetFooterSlot,
  SmartLink,
  Text,
  TextArea,
  TextField,
} from '@/shared/ui'
import {
  clearPartsRequestDraft,
  EMPTY_PARTS_REQUEST,
  hasPartsRequestDraft,
  readPartsRequestDraft,
  savePartsRequestDraft,
} from '../model/draft'
import { COMMENT_MAX_LENGTH, partsRequestSchema, type PartsRequestFormValues } from '../model/schema'
import { useScreenKeyboard } from '../model/use-screen-keyboard'
import styles from './parts-request-form.module.css'

const FORM_ID = 'parts-request-form'
const SEND_ERROR = 'Не удалось отправить заказ. Попробуйте ещё раз.'
const FIELD_ERRORS = {
  phone: 'Проверьте номер телефона',
  email: 'Проверьте адрес электронной почты',
  partNumber: 'Проверьте партномер запчасти',
  comment: 'Проверьте комментарий к заказу',
} as const

function submissionMessage(error: QueryError): string {
  if (error.code === 'duplicate') {
    return 'Повторная отправка доступна через 15 минут.'
  }
  if (error.code === 'invalid') return 'Проверьте заполнение полей. Если всё верно, попробуйте отправить заказ позже.'
  if (error.status === 503) return 'Не удалось связаться с сервером. Попробуйте ещё раз.'
  return SEND_ERROR
}

type PartsRequestFormProps = {
  createdAction: (call: PartsRequest, values: PartsRequestFormValues) => void
  valuesAction: (values: Partial<PartsRequestFormValues>) => void
  errorAction?: (hasError: boolean) => void
  activityAction?: () => void
}

export function PartsRequestForm({ createdAction, valuesAction, errorAction, activityAction }: PartsRequestFormProps) {
  const [createPartsRequest, { isLoading, error, reset: resetMutation }] = useCreatePartsRequestMutation()
  const [ready, setReady] = useState(false)
  const live = useRef(true)
  const discarded = useRef(false)
  const keyboardOpen = useScreenKeyboard()
  // Ошибка уходит с первой же правки поля: reValidateMode по умолчанию ('onChange') убирал бы её, только когда поле
  // стало валидным, а телефон валиден лишь на десятой цифре. Поэтому перевалидация по submit, а снимаем clearErrors.
  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    setError,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<PartsRequestFormValues>({
    resolver: zodResolver(partsRequestSchema),
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: EMPTY_PARTS_REQUEST,
  })
  const values = useWatch({ control })
  const hasError = Boolean(error) || Object.keys(errors).length > 0
  const isDuplicate = Boolean(error && 'code' in error && error.code === 'duplicate')

  useEffect(() => {
    errorAction?.(hasError)
  }, [hasError, errorAction])

  useEffect(() => {
    live.current = true
    const frame = requestAnimationFrame(() => {
      reset(readPartsRequestDraft())
      setReady(true)
    })
    return () => {
      live.current = false
      cancelAnimationFrame(frame)
    }
  }, [reset])

  useEffect(() => {
    if (!ready || discarded.current) return
    savePartsRequestDraft(values)
    valuesAction(values)
  }, [ready, values, valuesAction])

  useNavigationBlocker(ready && hasPartsRequestDraft(values), () => {
    discarded.current = true
    live.current = false
    clearPartsRequestDraft()
    reset(EMPTY_PARTS_REQUEST)
  })

  const clearFieldError = (name: keyof PartsRequestFormValues) => {
    clearErrors(name)
    if (error) resetMutation()
    activityAction?.()
  }

  const onValid = async (data: PartsRequestFormValues) => {
    if (isLoading || !ready) return
    const submitted = {
      ...data,
      partNumber: data.partNumber?.trim() || undefined,
      comment: data.comment?.trim() ? data.comment : undefined,
    }
    const result = await createPartsRequest({
      email: submitted.email,
      partNumber: submitted.partNumber,
      phone: submitted.phone,
      comment: submitted.comment,
    })
    if (!live.current || discarded.current) return
    if (result.error && 'status' in result.error) {
      let firstInvalid: keyof PartsRequestFormValues | undefined
      for (const name of ['phone', 'email', 'partNumber', 'comment'] as const) {
        if (result.error.attrErrors?.some((field) => field.attr === name)) {
          setError(name, { type: 'server', message: FIELD_ERRORS[name] })
          firstInvalid ??= name
        }
      }
      if (firstInvalid) setFocus(firstInvalid)
    }
    if (result.data) {
      discarded.current = true
      clearPartsRequestDraft()
      createdAction(result.data, submitted)
    }
  }

  return (
    <Box className={styles.main}>
      <Breadcrumb items={[{ label: 'Заказать запчасть' }]} />
      <Heading level={1} className={styles.title}>
        Заказать запчасть
      </Heading>
      <Form
        id={FORM_ID}
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onValid, (fieldErrors) => {
            // Controller регистрирует телефон позже обычных полей: задаём порядок по расположению в форме.
            const firstInvalid = (['phone', 'email', 'partNumber', 'comment'] as const).find(
              (name) => fieldErrors[name],
            )
            if (firstInvalid) setFocus(firstInvalid)
          })(event)
        }}
        className={styles.form}
        aria-busy={isLoading}
      >
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneField
              label="Телефон"
              required
              name={field.name}
              value={field.value ?? ''}
              disabled={!ready}
              onValueChange={(value) => {
                field.onChange(value)
                clearFieldError('phone')
              }}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.phone?.message}
              className={styles.phoneField}
            />
          )}
        />
        <TextField
          label="Адрес электронной почты"
          type="email"
          required
          autoComplete="email"
          disabled={!ready}
          error={errors.email?.message}
          className={styles.field}
          {...register('email', {
            onChange: () => {
              clearFieldError('email')
            },
          })}
        />
        <TextField
          label="Партномер запчасти"
          disabled={!ready}
          error={errors.partNumber?.message}
          className={styles.field}
          {...register('partNumber', {
            onChange: () => {
              clearFieldError('partNumber')
            },
          })}
        />
        <TextArea
          label="Комментарий к заказу"
          maxLength={COMMENT_MAX_LENGTH}
          value={values.comment ?? ''}
          rows={3}
          disabled={!ready}
          error={errors.comment?.message}
          textareaClassName={styles.comment}
          {...register('comment', {
            onChange: () => {
              clearFieldError('comment')
            },
          })}
        />
        <FormAlert
          variant={isDuplicate ? 'info' : 'error'}
          title={isDuplicate ? 'Вы уже отправляли заявку' : undefined}
          message={error ? ('status' in error ? submissionMessage(error) : SEND_ERROR) : undefined}
        />
        <Button
          type="submit"
          loading={isLoading}
          loadingIndicator="dots"
          disabled={!ready || isLoading}
          className={styles.desktopSubmit}
        >
          Заказать запчасть
        </Button>
        <Text className={styles.consent}>
          Нажимая кнопку «Заказать запчасть», я даю согласие на обработку моих персональных данных, в соответствии с
          Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных» для целей и на условиях, представленных
          в{' '}
          <SmartLink href={ROUTES.PRIVACY_POLICY} target="_blank" rel="noopener" className={styles.policy}>
            политике конфиденциальности
          </SmartLink>
        </Text>
      </Form>
      <SheetFooterSlot className={cn(styles.mobileFooter, keyboardOpen && styles.keyboardOpen)}>
        <Button
          type="submit"
          form={FORM_ID}
          loading={isLoading}
          loadingIndicator="dots"
          disabled={!ready || isLoading}
          className={styles.submit}
        >
          Заказать запчасть
        </Button>
      </SheetFooterSlot>
    </Box>
  )
}
