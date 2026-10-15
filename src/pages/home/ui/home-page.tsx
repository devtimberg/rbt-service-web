import { Box } from '@/shared/ui/Box'
import { Container } from '@/shared/ui/Container'
import { CatalogSearch } from '@/widgets/catalog-search'
import { Footer } from '@/widgets/footer'
import { HomeBenefitsStrip } from './home-benefits-strip'
import { HomeQuickAction } from './home-quick-action'

export function HomePage() {
  return (
    <Box className="flex h-full min-h-0 flex-col">
      <Box
        className="flex flex-1 flex-col justify-center px-4
          py-[clamp(8px,2vh,36px)] lg:px-0
          [@media(max-height:760px)]:py-1
          [@media(max-height:860px)]:py-2"
      >
        <Box
          className="mx-auto flex w-full flex-col
            gap-[clamp(28px,7.5vh,144px)]
            sm:gap-[clamp(24px,5vh,80px)]
            [@media(min-height:900px)]:gap-[clamp(80px,8vh,160px)]"
        >
          {/* Mobile: search in content */}
          <Container className="flex justify-center sm:hidden">
            <CatalogSearch expanded />
          </Container>
          {/* Desktop: spacer for header search that translates down */}
          <Box className="hidden h-18.5 sm:[@media(min-height:700px)]:block" aria-hidden="true" />
          <Box>
            <HomeQuickAction />
          </Box>
          <Box>
            <HomeBenefitsStrip />
          </Box>
        </Box>
      </Box>
      <Box
        className="mt-auto shrink-0 pb-[calc(env(safe-area-inset-bottom)+76px)]
          sm:pb-0"
      >
        <Footer />
      </Box>
    </Box>
  )
}
