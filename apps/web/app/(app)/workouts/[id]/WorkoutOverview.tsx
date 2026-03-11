"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface WorkoutExercise {
  id: string;
  order: number;
  exercise: {
    id: string;
    name: string;
    bodyPart: string;
    level: number;
  };
  sets: { setNumber: number; reps: number | null; weight: number | null }[];
}

interface ActiveSession {
  id: string;
  date: string | Date;
}

interface WorkoutOverviewProps {
  workout: {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
  };
  activeSession: ActiveSession | null;
}

export default function WorkoutOverview({ workout, activeSession }: WorkoutOverviewProps) {
  const router = useRouter();
  const t = useTranslations("workoutOverview");
  const tc = useTranslations("common");
  const [starting, setStarting] = useState(false);

  async function handleStart() {
    setStarting(true);
    const res = await fetch(`/api/workouts/${workout.id}/start`, { method: "POST" });
    if (res.ok) {
      const session = await res.json();
      router.push(`/workouts/${session.id}`);
    }
    setStarting(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => router.push("/workouts")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
          {workout.name}
        </Typography>
      </Box>

      {activeSession && (
        <Card
          variant="outlined"
          sx={{ mb: 2, borderColor: "primary.main", cursor: "pointer" }}
          onClick={() => router.push(`/workouts/${activeSession.id}`)}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 1, py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <PlayArrowIcon color="primary" />
            <Typography variant="body2" fontWeight="medium" sx={{ flex: 1 }}>
              {t("activeSession")}
            </Typography>
            <Button size="small" variant="text">
              {t("resume")}
            </Button>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<PlayArrowIcon />}
        onClick={handleStart}
        disabled={starting}
        sx={{ mb: 3 }}
      >
        {starting ? t("starting") : t("start")}
      </Button>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {workout.exercises.length} {tc("exercises")}
      </Typography>

      <Stack spacing={1.5}>
        {workout.exercises.map((wEx) => (
          <Card key={wEx.id} variant="outlined">
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {wEx.exercise.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {wEx.sets.length} {tc("sets")} · {tc("level", { level: wEx.exercise.level })}
                  </Typography>
                </Box>
                <Chip label={wEx.exercise.bodyPart} size="small" />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
