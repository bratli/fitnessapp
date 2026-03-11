"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00E676",
      light: "#66FFA6",
      dark: "#00B248",
    },
    secondary: {
      main: "#FF3D00",
      light: "#FF7539",
      dark: "#C30000",
    },
    background: {
      default: "#0A0A0A",
      paper: "#141414",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#A0A0A0",
    },
    success: {
      main: "#00E676",
    },
    warning: {
      main: "#FFD600",
    },
    error: {
      main: "#FF3D00",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto), sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.75rem" },
    button: { fontWeight: 700, letterSpacing: "0.04em" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: "none",
          fontWeight: 700,
          padding: "10px 24px",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
          color: "#0A0A0A",
          "&:hover": {
            background: "linear-gradient(135deg, #00C853 0%, #00E676 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0A0A0A",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#0A0A0A",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "#606060",
          "&.Mui-selected": {
            color: "#00E676",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
        barColorPrimary: {
          background: "linear-gradient(90deg, #00E676 0%, #00C853 100%)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;
