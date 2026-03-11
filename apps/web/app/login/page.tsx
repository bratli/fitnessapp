"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import SterkLogo from "@/components/SterkLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const ts = useTranslations();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : t("failed"));
      setLoading(false);
      return;
    }

    router.push("/exercises");
    router.refresh();
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <SterkLogo sx={{ fontSize: 72, mb: 1 }} />
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            letterSpacing: "0.1em",
            background: "linear-gradient(135deg, #00E676, #66FFA6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          STERK
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {ts("slogan")}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label={t("username")}
            fullWidth
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t("password")}
            type="password"
            fullWidth
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? t("loggingIn") : t("logIn")}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {t("noAccount")}{" "}
          <Link component={NextLink} href="/register">
            {t("register")}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
