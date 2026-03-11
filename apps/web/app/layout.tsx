import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STERK — Tren smart. Bli skadefri.",
  description: "Treningsapp for skadefri trening med øvelser, treningsøkter og historikk.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={roboto.variable}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
