import { CATALOG_CATEGORIES } from '@/entities/category'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { SmartLink } from '@/shared/ui/SmartLink'
import { Footer } from '@/widgets/footer'

const TEMP_HREF = '/catalog/refrigerators'

export function CatalogPage() {
  return (
    <Box className="flex grow flex-col">
      <Container>
        <Breadcrumb items={[{ label: 'Каталог' }]} />
      </Container>

      <Container className="mt-6 flex flex-col gap-10">
        {CATALOG_CATEGORIES.map((category) => (
          <Box as="section" key={category.title}>
            <Heading level={2} size="lg">
              {category.title}
            </Heading>
            <Box className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {category.items.map((item) => (
                <SmartLink
                  key={item}
                  href={TEMP_HREF}
                  className="text-primary-500 hover:text-primary-700 text-sm leading-6"
                >
                  {item}
                </SmartLink>
              ))}
            </Box>
          </Box>
        ))}
      </Container>

      <Box className="mt-auto">
        <Footer variant="default" />
      </Box>
    </Box>
  )
}
