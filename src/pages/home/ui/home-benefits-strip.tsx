import { SUPPORT_PHONE_HREF } from '@/shared/config'
import { Box, Container, Image, SmartLink, Text } from '@/shared/ui'
import { HOME_BENEFITS } from '../model/benefits'
import styles from './home-benefits-strip.module.css'

export function HomeBenefitsStrip() {
  return (
    <Container>
      <Box className={styles.benefits}>
        {HOME_BENEFITS.map((benefit) => {
          const content = (
            <>
              <Image src={benefit.iconSrc} alt="" width={48} height={48} className={styles.icon} aria-hidden />
              <Text as="span" className={styles.text}>
                {benefit.text}
              </Text>
            </>
          )

          return benefit.key === 'call' ? (
            <SmartLink key={benefit.key} href={SUPPORT_PHONE_HREF} className={styles.call}>
              {content}
            </SmartLink>
          ) : (
            <Box key={benefit.key} className={styles.benefit}>
              {content}
            </Box>
          )
        })}
      </Box>
    </Container>
  )
}
