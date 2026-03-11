"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";

const NAV_ITEMS = [
  { label: "Treningsøkter", href: "/workouts", icon: <ListAltIcon /> },
  { label: "Ny", href: "/workouts/new", icon: <AddCircleIcon /> },
  { label: "Øvelser", href: "/exercises", icon: <FitnessCenterIcon /> },
  { label: "Historikk", href: "/history", icon: <HistoryIcon /> },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
          <FitnessCenterIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fitness App
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Logg ut">
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
