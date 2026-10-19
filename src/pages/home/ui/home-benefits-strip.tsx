import { Box, Stack } from '@/shared/ui/Box'
import { Container } from '@/shared/ui/Container'
import { Image } from '@/shared/ui/Image'
import { Text } from '@/shared/ui/Text'
import { HOME_BENEFITS } from '../model/benefits'

export function HomeBenefitsStrip() {
  // Отдельный benefit с номером телефона для мобильного блока "Бесплатный звонок".
  const callBenefit = HOME_BENEFITS.find((benefit) => benefit.key === 'call')
  // Остальные преимущества, которые рендерятся в сетке/строках.
  const regularBenefits = HOME_BENEFITS.filter((benefit) => benefit.key !== 'call')
  // Разбиение списка для md..xl: первая строка (3 элемента), вторая строка (2 элемента).
  const desktopFirstRow = HOME_BENEFITS.slice(0, 3)
  const desktopSecondRow = HOME_BENEFITS.slice(3)

  return (
    <Container>
      {/* Мобильный блок "Бесплатный звонок" (виден только до md). */}
      {callBenefit ? (
        <Box
          className="bg-primary-300 mb-8 flex w-full items-center justify-center
            gap-3 rounded-3xl px-6 py-5 md:hidden"
        >
          <Image src={callBenefit.iconSrc} alt="" width={40} height={40} className="block" aria-hidden />
          <Text
            as="span"
            className="text-inverse text-[16px] leading-tight font-semibold
              whitespace-pre-wrap"
          >
            {callBenefit.text}
          </Text>
        </Box>
      ) : null}

      {/* Мобильная сетка преимуществ 2x2 без call-элемента. */}
      <Box
        className="text-inverse mx-auto grid w-max
          grid-cols-[repeat(2,max-content)] gap-x-8 gap-y-10 md:hidden"
      >
        {regularBenefits.map((benefit) => (
          <Stack direction="row" key={benefit.key} className="items-center" gap={2}>
            <Image src={benefit.iconSrc} alt="" width={32} height={32} className="block" aria-hidden />
            <Text
              as="span"
              className="text-inverse text-[12px] font-medium
                whitespace-pre-wrap"
            >
              {benefit.text}
            </Text>
          </Stack>
        ))}
      </Box>

      {/* Планшет/небольшой desktop: преимущества в две строки для лучшей читаемости. */}
      <Box className="hidden md:block xl:hidden">
        <Stack direction="row" className="justify-center" gap={10}>
          {desktopFirstRow.map((benefit) => (
            <Stack direction="row" key={benefit.key} className="items-center" gap={2}>
              <Image src={benefit.iconSrc} alt="" width={48} height={48} className="block" aria-hidden />
              <Text
                as="span"
                className="text-inverse text-[14px] font-medium
                  whitespace-pre-wrap"
              >
                {benefit.text}
              </Text>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" className="mt-6 justify-center" gap={10}>
          {desktopSecondRow.map((benefit) => (
            <Stack direction="row" key={benefit.key} className="items-center" gap={2}>
              <Image src={benefit.iconSrc} alt="" width={48} height={48} className="block" aria-hidden />
              <Text
                as="span"
                className="text-inverse text-[14px] font-medium
                  whitespace-pre-wrap"
              >
                {benefit.text}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Широкий desktop (xl+): один центрированный ряд из 5 элементов. */}
      <Box
        className="hidden xl:mx-auto xl:grid xl:w-max
          xl:grid-cols-[repeat(5,max-content)] xl:gap-x-10"
      >
        {HOME_BENEFITS.map((benefit) => (
          <Stack direction="row" key={benefit.key} className="items-center" gap={2}>
            <Image src={benefit.iconSrc} alt="" width={48} height={48} className="block" aria-hidden />
            <Text
              as="span"
              className="text-inverse text-[14px] font-semibold
                whitespace-pre-wrap"
            >
              {benefit.text}
            </Text>
          </Stack>
        ))}
      </Box>
    </Container>
  )
}
