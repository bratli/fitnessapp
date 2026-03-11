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

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");
  const ts = useTranslations();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, name: name || undefined }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (typeof data.error === "string") {
        setError(data.error);
      } else if (Array.isArray(data.error)) {
        setError(data.error.map((e: { message: string }) => e.message).join(". "));
      } else {
        setError(t("failed"));
      }
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
            label={t("email")}
            type="email"
            fullWidth
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t("nameOptional")}
            fullWidth
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t("password")}
            type="password"
            fullWidth
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={t("minChars")}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? t("registering") : t("register")}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {t("hasAccount")}{" "}
          <Link component={NextLink} href="/login">
            {t("logIn")}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
