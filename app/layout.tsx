import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Header, MobileBottomNav } from "@/widgets";
import { RouteContentTransition } from "@/shared/ui/route-content-transition";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru-RU">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-primary-500 lg:bg-primary-900 flex h-dvh min-h-dvh w-full flex-col overflow-hidden p-0 antialiased lg:p-4 lg:py-4`}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:overflow-hidden">
          <Header />
          <RouteContentTransition>{children}</RouteContentTransition>
        </div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
