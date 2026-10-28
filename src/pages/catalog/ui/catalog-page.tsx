import { CATALOG_CATEGORIES } from '@/entities/category'
import { Box, Breadcrumb, Container, Heading, SmartLink } from '@/shared/ui'
import { Footer } from '@/widgets/footer'
import styles from './catalog-page.module.css'

const TEMP_HREF = '/catalog/refrigerators'

export function CatalogPage() {
  return (
    <Box className={styles.root}>
      <Container>
        <Breadcrumb items={[{ label: 'Каталог' }]} />
      </Container>

      <Container className={styles.sections}>
        {CATALOG_CATEGORIES.map((category) => (
          <Box as="section" key={category.title}>
            <Heading level={2} size="lg">
              {category.title}
            </Heading>
            <Box className={styles.items}>
              {category.items.map((item) => (
                <SmartLink key={item} href={TEMP_HREF} className={styles.link}>
                  {item}
                </SmartLink>
              ))}
            </Box>
          </Box>
        ))}
      </Container>

      <Box className={styles.footer}>
        <Footer variant="default" />
      </Box>
    </Box>
  )
}
