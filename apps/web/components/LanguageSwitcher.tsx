"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import LanguageIcon from "@mui/icons-material/Language";
import { setLocale } from "@/lib/locale";

const LOCALE_LABELS: Record<string, string> = {
  nb: "Norsk",
  en: "English",
  es: "Español",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleSelect(newLocale: string) {
    setAnchorEl(null);
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  }

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <LanguageIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {Object.entries(LOCALE_LABELS).map(([key, label]) => (
          <MenuItem key={key} selected={key === locale} onClick={() => handleSelect(key)}>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
