"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Alert from "@mui/material/Alert";

interface WorkoutSummary {
  id: string;
  name: string;
  exercises: {
    exercise: { name: string; bodyPart: string };
    sets: { completed: boolean }[];
  }[];
}

interface ActiveSession {
  id: string;
  name: string;
}

interface WorkoutListProps {
  workouts: WorkoutSummary[];
  userName: string;
  activeSession: ActiveSession | null;
}

export default function WorkoutList({ workouts, userName, activeSession }: WorkoutListProps) {
  const router = useRouter();
  const t = useTranslations("workoutList");
  const tc = useTranslations("common");

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Welcome greeting */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("greeting", { name: userName })}
      </Typography>

      {/* Active session banner */}
      {activeSession && (
        <Alert
          severity="info"
          sx={{ mb: 2, cursor: "pointer" }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={() => router.push(`/workouts/${activeSession.id}`)}
            >
              {t("continueWorkout")}
            </Button>
          }
          onClick={() => router.push(`/workouts/${activeSession.id}`)}
        >
          {t("activeSession")} – <strong>{activeSession.name}</strong>
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          {t("title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => router.push("/workouts/new")}
        >
          {t("new")}
        </Button>
      </Box>

      {workouts.length === 0 && (
        <Typography color="text.secondary">
          {t("empty")}
        </Typography>
      )}

      <Stack spacing={2}>
        {workouts.map((workout) => {
          const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
          const bodyParts = [...new Set(workout.exercises.map((e) => e.exercise.bodyPart))];

          return (
            <Card key={workout.id} variant="outlined">
              <CardActionArea onClick={() => router.push(`/workouts/${workout.id}`)}>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {workout.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1, mb: 1 }}>
                    {bodyParts.map((bp) => (
                      <Chip key={bp} label={bp} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {workout.exercises.length} {tc("exercises")} · {totalSets} {tc("sets")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
