"use server";

import { cookies } from "next/headers";
import { locales, type Locale, defaultLocale } from "@/i18n/request";

export async function setLocale(locale: string) {
  if (!locales.includes(locale as Locale)) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });
}

export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  return locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
}
