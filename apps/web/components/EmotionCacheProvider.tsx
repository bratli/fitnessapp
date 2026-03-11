"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";

export default function EmotionCacheProvider({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: "mui" });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    let styles = "";
    const dataEmotionAttribute = cache.key;
    const names: string[] = [];

    for (const [name, value] of entries) {
      if (typeof value === "string") {
        names.push(name);
        styles += value;
      }
    }

    return (
      <style
        key={dataEmotionAttribute}
        data-emotion={`${dataEmotionAttribute} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
