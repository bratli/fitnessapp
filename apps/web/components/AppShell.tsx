"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SterkLogo from "./SterkLogo";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const NAV_ITEMS = [
    { label: t("workouts"), href: "/workouts", icon: <ListAltIcon /> },
    { label: t("new"), href: "/workouts/new", icon: <AddCircleIcon /> },
    { label: t("exercises"), href: "/exercises", icon: <FitnessCenterIcon /> },
    { label: t("history"), href: "/history", icon: <HistoryIcon /> },
    { label: t("profile"), href: "/profile", icon: <PersonIcon /> },
  ];

  const currentIndex = NAV_ITEMS.findIndex((item) => pathname.startsWith(item.href));

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <SterkLogo sx={{ fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #00E676, #66FFA6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            STERK
          </Typography>
          <LanguageSwitcher />
          <IconButton color="inherit" onClick={handleLogout} title={tc("logOut")}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, pb: 7 }}>
        {children}
      </Box>

      <BottomNavigation
        value={currentIndex}
        onChange={(_, newValue) => {
          router.push(NAV_ITEMS[newValue].href);
        }}
        showLabels
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1200 }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction key={item.href} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Box>
  );
}
