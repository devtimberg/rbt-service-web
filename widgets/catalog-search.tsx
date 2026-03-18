import Link from "next/link";
import { SearchIcon } from "@/shared/icons";
import { SearchInput } from "@/shared/ui/kit";

export function CatalogSearch() {
  return (
    <>
      <Link
        href="/search"
        aria-label="Поиск запчастей"
        className="flex h-[74px] w-full items-center rounded-[24px] bg-white px-4 py-2 outline-none focus:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent] md:hidden"
      >
        <span className="text-input-placeholder h-full min-w-0 flex-1 content-center pr-4 pl-3 text-[18px] leading-none">
          Поиск запчастей
        </span>
        <span className="bg-primary-500 inline-flex size-12 shrink-0 items-center justify-center rounded-[16px] text-white shadow-[0_0_19px_7px_rgba(0,64,183,0.16)]">
          <SearchIcon
            className="size-7"
            aria-hidden
          />
        </span>
      </Link>
      <div className="hidden w-full md:flex md:justify-center">
        <SearchInput />
      </div>
    </>
  );
}
