import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["nb", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nb";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
