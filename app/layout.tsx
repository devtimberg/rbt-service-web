import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Header, MobileBottomNav } from "@/widgets";
import { TooltipProvider, ScrollArea } from "@/shared/ui/kit";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "Сервисный центр ООО ТТЦ Рембыттехника",
  description:
    "На сегодняшний день, практически все люди без исключения пользуются различными видами бытовой техники, компьютерами и смартфонами. Трудно представить дом без стиральной или посудомоечной машины, холодильника или морозильной камеры, водонагревательных приборов или варочной поверхности. Однако любая техника иногда подводит, выходя из строя или отказываясь работать. Причины неисправности могут быть абсолютно разные, от неправильной эксплуатации техники до естественного износа деталей и их поломки. ",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  return (
    <html lang="ru-RU">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-primary-500
          lg:bg-primary-900 flex h-dvh min-h-dvh w-full flex-col overflow-hidden
          p-0 antialiased lg:p-4 lg:py-4`}
      >
        <TooltipProvider delayDuration={300}>
          <ScrollArea
            data-layout-scroll-container="true"
            className="bg-primary-500 relative min-h-0 flex-1
              rounded-none lg:rounded-[40px]"
            viewportClassName="flex flex-col"
          >
            <Header />
            <div
              data-layout-main-content="true"
              className="flex min-h-0 flex-1 flex-col"
            >
              {children}
            </div>
          </ScrollArea>
          <MobileBottomNav />
          {sheet}
          <div
            id="portal-root"
            data-portal-root="true"
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
