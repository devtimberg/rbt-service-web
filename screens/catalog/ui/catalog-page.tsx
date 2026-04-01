import Link from "next/link";
import { Breadcrumb, Container, Heading } from "@/shared/ui/kit";
import { CATALOG_CATEGORIES } from "../model";

const TEMP_HREF = "/catalog/refrigerators";

export function CatalogPage() {
  return (
    <>
      <Container>
        <Breadcrumb items={[{ label: "Каталог" }]} />
      </Container>

      <Container className="mt-6 flex flex-col gap-10">
        {CATALOG_CATEGORIES.map((category) => (
          <section key={category.title}>
            <Heading size="lg">{category.title}</Heading>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {category.items.map((item) => (
                <Link
                  key={item}
                  href={TEMP_HREF}
                  className="text-primary-500 hover:text-primary-700 text-sm leading-6"
                >
                  {item}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
