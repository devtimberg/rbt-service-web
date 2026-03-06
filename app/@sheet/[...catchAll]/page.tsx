import { ROUTES, getRouteConfig } from "@/shared/lib/routes";

type SheetCatchAllPageProps = {
  params: Promise<{
    catchAll?: string[];
  }>;
};

function resolvePath(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) {
    return ROUTES.HOME;
  }

  return `/${segments.join("/")}`;
}

export default async function SheetCatchAllPage({
  params,
}: SheetCatchAllPageProps) {
  const resolvedParams = await params;
  const pathname = resolvePath(resolvedParams.catchAll);

  if (pathname === ROUTES.HOME) {
    return null;
  }

  const config = getRouteConfig(pathname);
  const SheetComponent = config.sheetComponent;

  if (SheetComponent) {
    return <SheetComponent />;
  }

  return null;
}
