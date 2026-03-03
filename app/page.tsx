import { Container } from "@/src/shared/ui/kit";
import { Header } from "@/src/widgets";
import { CatalogSearch } from "@/src/widgets/catalog-search";

export default function Home() {
  return (
    <div className="bg-primary-500 h-[calc(100vh-32px)] rounded-[40px]">
      <Header />
      <Container className="mt-40 flex justify-center">
        <CatalogSearch />
      </Container>
    </div>
  );
}
