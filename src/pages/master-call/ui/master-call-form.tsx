'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useCreateMasterCallMutation, type MasterCall } from '@/entities/master-call'
import { UNKNOWN_ERROR_MESSAGE } from '@/shared/api'
import {
  Box,
  Breadcrumb,
  Button,
  Container,
  Form,
  FormAlert,
  Heading,
  PhoneField,
  Select,
  SheetFooterSlot,
  TextArea,
} from '@/shared/ui'
import { APPLIANCE_CATEGORIES } from '../model/categories'
import { COMMENT_MAX_LENGTH, masterCallSchema, type MasterCallFormValues } from '../model/schema'
import { formatReceiptDate, useReceiptClock } from '../model/use-receipt-clock'
import { CallReceipt } from './call-receipt'
import styles from './master-call-form.module.css'

const FORM_ID = 'master-call-form'
const OPTIONS = APPLIANCE_CATEGORIES.map((c) => ({ value: c.label, label: c.label }))

export function MasterCallForm({
  createdAction,
}: {
  createdAction: (call: MasterCall, values: MasterCallFormValues) => void
}) {
  const [createMasterCall, { isLoading, error }] = useCreateMasterCallMutation()
  const clock = useReceiptClock()
  // Ошибка уходит с первой же правки поля: reValidateMode по умолчанию ('onChange') убирал бы её, только когда поле
  // стало валидным, а телефон валиден лишь на десятой цифре. Поэтому перевалидация по submit, а снимаем clearErrors.
  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<MasterCallFormValues>({
    resolver: zodResolver(masterCallSchema),
    reValidateMode: 'onSubmit',
    defaultValues: { category: '', phone: '', comment: '' },
  })
  const values = useWatch({ control })

  const onValid = async (data: MasterCallFormValues) => {
    const result = await createMasterCall(data)
    if (result.data) createdAction(result.data, data)
  }

  return (
    <Container className={styles.root}>
      <Box className={styles.main}>
        <Breadcrumb items={[{ label: 'Вызвать мастера' }]} />
        <Heading level={1} size="xl" className={styles.title}>
          Вызвать мастера
        </Heading>

        <Form id={FORM_ID} noValidate onSubmit={handleSubmit(onValid)} className={styles.form}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                label="Вид техники"
                name={field.name}
                value={field.value ?? ''}
                options={OPTIONS}
                error={errors.category?.message}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  clearErrors('category')
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneField
                label="Номер телефона"
                name={field.name}
                value={field.value ?? ''}
                onValueChange={(value) => {
                  field.onChange(value)
                  clearErrors('phone')
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                error={errors.phone?.message}
              />
            )}
          />
          <TextArea
            label="Комментарий к заявке"
            maxLength={COMMENT_MAX_LENGTH}
            error={errors.comment?.message}
            {...register('comment', { onChange: () => clearErrors('comment') })}
          />
          <FormAlert message={error ? UNKNOWN_ERROR_MESSAGE : undefined} />
        </Form>
      </Box>

      <CallReceipt
        category={values.category}
        phone={values.phone}
        comment={values.comment}
        date={formatReceiptDate(clock)}
        className={styles.receipt}
        consent
      />

      <SheetFooterSlot contentClassName={styles.footerContent}>
        <Button type="submit" form={FORM_ID} loading={isLoading} className={styles.submit}>
          Создать заявку
        </Button>
      </SheetFooterSlot>
    </Container>
  )
}
