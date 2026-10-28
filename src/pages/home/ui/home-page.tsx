import { Box } from '@/shared/ui/Box'
import { Container } from '@/shared/ui/Container'
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
          {/* Mobile: search in content */}
          <Container className={styles.mobileSearch}>
            <CatalogSearch expanded />
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
