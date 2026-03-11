"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import NextLink from "next/link";

export default function RegisterPage() {
  const router = useRouter();
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
        setError("Registrering feilet");
      }
      setLoading(false);
      return;
    }

    router.push("/exercises");
    router.refresh();
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 56, color: "primary.main", mb: 1 }} />
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Registrer deg
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Brukernavn"
            fullWidth
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="E-post"
            type="email"
            fullWidth
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Navn (valgfritt)"
            fullWidth
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Passord"
            type="password"
            fullWidth
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Minst 8 tegn"
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? "Registrerer..." : "Registrer"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Har du allerede en konto?{" "}
          <Link component={NextLink} href="/login">
            Logg inn
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
