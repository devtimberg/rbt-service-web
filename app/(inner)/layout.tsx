import { LayoutSheet } from "@/shared/ui/kit";

export default function InnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutSheet>{children}</LayoutSheet>;
}
