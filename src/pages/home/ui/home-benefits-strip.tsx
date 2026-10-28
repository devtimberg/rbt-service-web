import { Box, Stack, Container, Image, Text } from '@/shared/ui'
import { HOME_BENEFITS } from '../model/benefits'
import styles from './home-benefits-strip.module.css'

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
        <Box className={styles.callBlock}>
          <Image src={callBenefit.iconSrc} alt="" width={40} height={40} className={styles.icon} aria-hidden />
          <Text as="span" className={styles.callText}>
            {callBenefit.text}
          </Text>
        </Box>
      ) : null}

      {/* Мобильная сетка преимуществ 2x2 без call-элемента. */}
      <Box className={styles.mobileGrid}>
        {regularBenefits.map((benefit) => (
          <Stack direction="row" key={benefit.key} align="center" gap={2}>
            <Image src={benefit.iconSrc} alt="" width={32} height={32} className={styles.icon} aria-hidden />
            <Text as="span" className={styles.mobileText}>
              {benefit.text}
            </Text>
          </Stack>
        ))}
      </Box>

      {/* Планшет/небольшой desktop: преимущества в две строки для лучшей читаемости. */}
      <Box className={styles.tablet}>
        <Stack direction="row" justify="center" gap={10}>
          {desktopFirstRow.map((benefit) => (
            <Stack direction="row" key={benefit.key} align="center" gap={2}>
              <Image src={benefit.iconSrc} alt="" width={48} height={48} className={styles.icon} aria-hidden />
              <Text as="span" className={styles.tabletText}>
                {benefit.text}
              </Text>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" justify="center" className={styles.secondRow} gap={10}>
          {desktopSecondRow.map((benefit) => (
            <Stack direction="row" key={benefit.key} align="center" gap={2}>
              <Image src={benefit.iconSrc} alt="" width={48} height={48} className={styles.icon} aria-hidden />
              <Text as="span" className={styles.tabletText}>
                {benefit.text}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Широкий desktop (xl+): один центрированный ряд из 5 элементов. */}
      <Box className={styles.wide}>
        {HOME_BENEFITS.map((benefit) => (
          <Stack direction="row" key={benefit.key} align="center" gap={2}>
            <Image src={benefit.iconSrc} alt="" width={48} height={48} className={styles.icon} aria-hidden />
            <Text as="span" className={styles.wideText}>
              {benefit.text}
            </Text>
          </Stack>
        ))}
      </Box>
    </Container>
  )
}
