import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { MobileBottomNav } from "@/widgets";
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
        className={`${geistSans.variable} ${geistMono.variable} bg-primary-500 p-0 pb-[88px] antialiased sm:pb-0 lg:bg-primary-900 lg:p-4`}
      >
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
