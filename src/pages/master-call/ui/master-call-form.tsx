'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useCreateMasterCallMutation, type MasterCall } from '@/entities/master-call'
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
  Select,
  SheetFooterSlot,
  SmartLink,
  Text,
  TextArea,
  TextField,
} from '@/shared/ui'
import { APPLIANCE_CATEGORIES, OTHER_CATEGORY_LABEL, resolveApplianceCategory } from '../model/categories'
import {
  clearMasterCallDraft,
  EMPTY_MASTER_CALL,
  hasMasterCallDraft,
  readMasterCallDraft,
  saveMasterCallDraft,
} from '../model/draft'
import {
  COMMENT_MAX_LENGTH,
  CUSTOM_CATEGORY_MAX_LENGTH,
  masterCallSchema,
  type MasterCallFormValues,
} from '../model/schema'
import { useScreenKeyboard } from '../model/use-screen-keyboard'
import styles from './master-call-form.module.css'

const FORM_ID = 'master-call-form'
const SEND_ERROR = 'Не удалось отправить заявку. Попробуйте ещё раз.'
const FIELD_ERRORS = {
  category: 'Проверьте вид техники',
  customCategory: 'Проверьте название техники',
  phone: 'Проверьте номер телефона',
  comment: 'Проверьте комментарий к заявке',
} as const

function submissionMessage(error: QueryError): string {
  if (error.code === 'duplicate') {
    return 'Повторная отправка доступна через 15 минут.'
  }
  if (error.code === 'invalid') return 'Проверьте заполнение полей. Если всё верно, попробуйте отправить заявку позже.'
  if (error.status === 503) return 'Не удалось связаться с сервером. Попробуйте ещё раз.'
  return SEND_ERROR
}
const OPTIONS = APPLIANCE_CATEGORIES.map((category) => ({ value: category.label, label: category.label }))

type MasterCallFormProps = {
  createdAction: (call: MasterCall, values: MasterCallFormValues) => void
  valuesAction: (values: Partial<MasterCallFormValues>) => void
  errorAction?: (hasError: boolean) => void
  activityAction?: () => void
}

export function MasterCallForm({ createdAction, valuesAction, errorAction, activityAction }: MasterCallFormProps) {
  const [createMasterCall, { isLoading, error, reset: resetMutation }] = useCreateMasterCallMutation()
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
  } = useForm<MasterCallFormValues>({
    resolver: zodResolver(masterCallSchema),
    reValidateMode: 'onSubmit',
    defaultValues: EMPTY_MASTER_CALL,
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
      reset(readMasterCallDraft())
      setReady(true)
    })
    return () => {
      live.current = false
      cancelAnimationFrame(frame)
    }
  }, [reset])

  useEffect(() => {
    if (!ready || discarded.current) return
    saveMasterCallDraft(values)
    valuesAction(values)
  }, [ready, values, valuesAction])

  useNavigationBlocker(ready && hasMasterCallDraft(values), () => {
    discarded.current = true
    live.current = false
    clearMasterCallDraft()
    reset(EMPTY_MASTER_CALL)
  })

  const clearFieldError = (name: keyof MasterCallFormValues) => {
    clearErrors(name)
    if (error) resetMutation()
    activityAction?.()
  }

  const onValid = async (data: MasterCallFormValues) => {
    if (isLoading || !ready) return
    const submitted = {
      ...data,
      category: resolveApplianceCategory(data),
      comment: data.comment?.trim() ? data.comment : undefined,
    }
    const result = await createMasterCall({
      category: data.category,
      customCategory: data.customCategory,
      phone: submitted.phone,
      comment: submitted.comment,
    })
    if (!live.current || discarded.current) return
    if (result.error && 'status' in result.error) {
      const fieldNames = {
        equipmentType: 'category',
        equipmentName: data.category === OTHER_CATEGORY_LABEL ? 'customCategory' : 'category',
        phone: 'phone',
        comment: 'comment',
      } as const
      const invalidFields = new Set<keyof MasterCallFormValues>()
      for (const [attr, name] of Object.entries(fieldNames)) {
        if (result.error.attrErrors?.some((field) => field.attr === attr)) {
          setError(name, { type: 'server', message: FIELD_ERRORS[name] })
          invalidFields.add(name)
        }
      }
      const firstInvalid = (['category', 'customCategory', 'phone', 'comment'] as const).find((name) =>
        invalidFields.has(name),
      )
      if (firstInvalid) setFocus(firstInvalid)
    }
    if (result.data) {
      discarded.current = true
      clearMasterCallDraft()
      createdAction(result.data, submitted)
    }
  }

  return (
    <Box className={styles.main}>
      <Breadcrumb items={[{ label: 'Вызвать мастера' }]} />
      <Heading level={1} className={styles.title}>
        Вызвать мастера
      </Heading>
      <Form
        id={FORM_ID}
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onValid)(event)
        }}
        className={styles.form}
        aria-busy={isLoading}
      >
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              presentation="responsive"
              label="Вид техники"
              name={field.name}
              value={field.value ?? ''}
              options={OPTIONS}
              disabled={!ready}
              error={errors.category?.message}
              controlRef={field.ref}
              onControlBlur={field.onBlur}
              onValueChange={(value) => {
                field.onChange(value)
                clearErrors('customCategory')
                clearFieldError('category')
              }}
            />
          )}
        />
        {values.category === OTHER_CATEGORY_LABEL && (
          <TextField
            label="Ваш вариант техники"
            maxLength={CUSTOM_CATEGORY_MAX_LENGTH}
            disabled={!ready}
            error={errors.customCategory?.message}
            className={styles.customField}
            {...register('customCategory', {
              onChange: () => {
                clearFieldError('customCategory')
              },
            })}
          />
        )}
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneField
              label="Номер телефона"
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
        <TextArea
          label="Комментарий к заявке"
          maxLength={COMMENT_MAX_LENGTH}
          value={values.comment ?? ''}
          rows={4}
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
          Создать заявку
        </Button>
        <Text className={styles.consent}>
          Нажимая кнопку «Создать заявку», я даю согласие на обработку моих персональных данных, в соответствии с
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
          Создать заявку
        </Button>
      </SheetFooterSlot>
    </Box>
  )
}
