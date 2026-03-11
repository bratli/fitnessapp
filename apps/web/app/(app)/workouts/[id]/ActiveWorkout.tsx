"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface ExerciseSet {
  id: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  order: number;
  exercise: {
    id: string;
    name: string;
    description: string | null;
    videoUrl: string | null;
    bodyPart: string;
    level: number;
  };
  sets: ExerciseSet[];
}

interface Workout {
  id: string;
  name: string;
  date: string | Date;
  completed: boolean;
  exercises: WorkoutExercise[];
}

interface ActiveWorkoutProps {
  workout: Workout;
}

export default function ActiveWorkout({ workout: initialWorkout }: ActiveWorkoutProps) {
  const router = useRouter();
  const [workout, setWorkout] = useState(initialWorkout);

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0,
  );
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  async function toggleSet(workoutExerciseId: string, setId: string, completed: boolean) {
    const res = await fetch(`/api/sets/${setId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) return;

    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== workoutExerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, completed } : s)),
        };
      }),
    }));
  }

  async function updateSetField(
    workoutExerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string,
  ) {
    const numVal = value === "" ? null : Number(value);

    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== workoutExerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: numVal } : s)),
        };
      }),
    }));

    await fetch(`/api/sets/${setId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: numVal === null ? undefined : numVal }),
    });
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={() => router.push("/workouts")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {workout.name}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Fremgang
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completedSets}/{totalSets} sett
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Stack spacing={2}>
        {workout.exercises.map((wEx) => (
          <Card key={wEx.id} variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {wEx.exercise.name}
                  </Typography>
                  <Chip label={wEx.exercise.bodyPart} size="small" sx={{ mt: 0.5 }} />
                </Box>
                <IconButton
                  onClick={() => router.push(`/exercises/${wEx.exercise.id}`)}
                  size="small"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Box>

              {wEx.exercise.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {wEx.exercise.description}
                </Typography>
              )}

              {wEx.sets.map((set) => (
                <Box
                  key={set.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                    opacity: set.completed ? 0.6 : 1,
                  }}
                >
                  <Checkbox
                    checked={set.completed}
                    onChange={(e) => toggleSet(wEx.id, set.id, e.target.checked)}
                    size="small"
                  />
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    Sett {set.setNumber}
                  </Typography>
                  <TextField
                    label="Reps"
                    type="number"
                    size="small"
                    value={set.reps ?? ""}
                    onChange={(e) => updateSetField(wEx.id, set.id, "reps", e.target.value)}
                    sx={{ width: 75 }}
                  />
                  <TextField
                    label="Vekt"
                    type="number"
                    size="small"
                    value={set.weight ?? ""}
                    onChange={(e) => updateSetField(wEx.id, set.id, "weight", e.target.value)}
                    sx={{ width: 85 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
