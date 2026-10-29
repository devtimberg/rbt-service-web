'use client'

import { MvpNotice } from '@/features/locked-section'
import { Box, Container } from '@/shared/ui'
import { CatalogSearch } from '@/widgets/catalog-search'
import { Footer } from '@/widgets/footer'
import { HomeBenefitsStrip } from './home-benefits-strip'
import { HomeQuickAction } from './home-quick-action'
import styles from './home-page.module.css'

export function HomePage() {
  return (
    <Box className={styles.root}>
      <Box className={styles.content}>
        <Box className={styles.stack}>
          {/* До xl поиск в контенте и плашка MVP под ним; от xl на высоком экране их рисует шапка */}
          <Container className={styles.top}>
            {/* data-home: от sm поиск в контенте крупный, как в шапке главной */}
            <Box data-home="" className={styles.mobileSearch}>
              <CatalogSearch expanded />
            </Box>
            <MvpNotice className={styles.notice} />
          </Container>
          {/* Desktop: spacer for header search that translates down */}
          <Box className={styles.searchSpacer} aria-hidden="true" />
          <Box>
            <HomeQuickAction />
          </Box>
          <Box>
            <HomeBenefitsStrip />
          </Box>
        </Box>
      </Box>
      <Box className={styles.footer}>
        <Footer />
      </Box>
    </Box>
  )
}
