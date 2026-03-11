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
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DialogActions from "@mui/material/DialogActions";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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
  allExercises: {
    id: string;
    name: string;
    bodyPart: string;
    level: number;
    defaultSets: number;
    defaultReps: string;
    videoUrl: string | null;
  }[];
}

export default function ActiveWorkout({ workout: initialWorkout, allExercises }: ActiveWorkoutProps) {
  const router = useRouter();
  const t = useTranslations("activeWorkout");
  const tc = useTranslations("common");
  const [workout, setWorkout] = useState(initialWorkout);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bodyPartFilter, setBodyPartFilter] = useState("");
  const [addingExercise, setAddingExercise] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const bodyParts = [...new Set(allExercises.map((e) => e.bodyPart))];
  const filteredExercises = bodyPartFilter
    ? allExercises.filter((e) => e.bodyPart === bodyPartFilter)
    : allExercises;

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

    setWorkout((prev) => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== workoutExerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, completed } : s)),
          };
        }),
      };

      if (completed) {
        const allDone = updated.exercises.every((ex) => ex.sets.every((s) => s.completed));
        if (allDone) {
          finishWorkout();
        }
      }

      return updated;
    });
  }

  async function finishWorkout() {
    setFinishing(true);
    await fetch(`/api/workouts/${workout.id}`, { method: "PATCH" });
    setShowCelebration(true);
    setFinishing(false);
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

  async function addExerciseToWorkout(exerciseId: string) {
    const exercise = allExercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    setAddingExercise(true);

    const repsNum = parseInt(exercise.defaultReps, 10);
    const defaultReps = Number.isNaN(repsNum) ? undefined : repsNum;

    const sets = Array.from({ length: exercise.defaultSets }, (_, i) => ({
      setNumber: i + 1,
      reps: defaultReps,
      weight: undefined as number | undefined,
      duration: undefined as number | undefined,
    }));

    const res = await fetch(`/api/workouts/${workout.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId, sets }),
    });

    if (res.ok) {
      const workoutExercise = await res.json();
      setWorkout((prev) => ({
        ...prev,
        exercises: [...prev.exercises, workoutExercise],
      }));
    }

    setAddingExercise(false);
    setShowAddDialog(false);
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
            {t("progress")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completedSets}/{totalSets} {tc("sets")}
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
                    {tc("set", { number: set.setNumber })}
                  </Typography>
                  <TextField
                    label={tc("reps")}
                    type="number"
                    size="small"
                    value={set.reps ?? ""}
                    onChange={(e) => updateSetField(wEx.id, set.id, "reps", e.target.value)}
                    sx={{ width: 75 }}
                  />
                  <TextField
                    label={tc("weight")}
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
      <Button
        variant="outlined"
        fullWidth
        startIcon={<AddIcon />}
        onClick={() => setShowAddDialog(true)}
        sx={{ mt: 2 }}
      >
        {t("addExercise")}
      </Button>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={finishWorkout}
        disabled={finishing}
        sx={{ mt: 2 }}
      >
        {finishing ? t("finishing") : t("finish")}
      </Button>

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("addExercise")}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
            <InputLabel>{t("bodyPart")}</InputLabel>
            <Select
              value={bodyPartFilter}
              label={t("bodyPart")}
              onChange={(e) => setBodyPartFilter(e.target.value)}
            >
              <MenuItem value="">{tc("all")}</MenuItem>
              {bodyParts.map((bp) => (
                <MenuItem key={bp} value={bp}>
                  {bp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <List disablePadding>
            {filteredExercises.map((ex) => (
              <ListItemButton
                key={ex.id}
                onClick={() => addExerciseToWorkout(ex.id)}
                disabled={addingExercise}
              >
                <ListItemText
                  primary={ex.name}
                  secondary={`${ex.bodyPart} · ${tc("level", { level: ex.level })} · ${ex.defaultSets} x ${ex.defaultReps}`}
                />
                {ex.videoUrl && (
                  <PlayCircleOutlineIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
                )}
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Dialog open={showCelebration} onClose={() => setShowCelebration(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <EmojiEventsIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t("celebrationTitle")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("celebrationMessage")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setShowCelebration(false);
              router.push("/workouts");
            }}
          >
            {t("celebrationClose")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
