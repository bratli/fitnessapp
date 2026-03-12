"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  level: number;
  defaultSets: number;
  defaultReps: string;
  videoUrl: string | null;
}

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

interface SelectedExercise {
  exerciseId: string;
  sets: { setNumber: number; reps: number | undefined; weight: number | undefined }[];
}

interface EditWorkoutFormProps {
  workout: {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
  };
  exercises: Exercise[];
  favouriteIds: string[];
}

export default function EditWorkoutForm({ workout, exercises, favouriteIds }: EditWorkoutFormProps) {
  const router = useRouter();
  const t = useTranslations("editWorkout");
  const tc = useTranslations("common");
  const te = useTranslations("exercises");
  const [name, setName] = useState(workout.name);
  const [nameError, setNameError] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
    workout.exercises.map((wEx) => ({
      exerciseId: wEx.exercise.id,
      sets: wEx.sets.map((s) => ({
        setNumber: s.setNumber,
        reps: s.reps ?? undefined,
        weight: s.weight ?? undefined,
      })),
    })),
  );
  const [exercisesError, setExercisesError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState(0);

  const bodyParts = [...new Set(exercises.map((e) => e.bodyPart))];
  const favouriteSet = new Set(favouriteIds);
  const hasFavourites = favouriteIds.length > 0;
  const pickerTabs = [tc("all"), ...(hasFavourites ? [te("favourites")] : []), ...bodyParts];
  const favouritesTabIndex = hasFavourites ? 1 : -1;

  const pickerExercises =
    pickerTab === 0
      ? exercises
      : hasFavourites && pickerTab === favouritesTabIndex
        ? exercises.filter((e) => favouriteSet.has(e.id))
        : exercises.filter((e) => e.bodyPart === pickerTabs[pickerTab]);

  function addExercise(exerciseId: string) {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const repsNum = parseInt(exercise.defaultReps, 10);
    const defaultReps = Number.isNaN(repsNum) ? undefined : repsNum;

    const sets = Array.from({ length: exercise.defaultSets }, (_, i) => ({
      setNumber: i + 1,
      reps: defaultReps,
      weight: undefined,
    }));

    setSelectedExercises((prev) => [...prev, { exerciseId, sets }]);
    setExercisesError("");
    setShowPicker(false);
  }

  function removeExercise(index: number) {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSet(
    exIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string,
  ) {
    setSelectedExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, si) => {
            if (si !== setIndex) return s;
            const numVal = value === "" ? undefined : Number(value);
            return { ...s, [field]: numVal };
          }),
        };
      }),
    );
  }

  function addSet(exIndex: number) {
    setSelectedExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIndex) return ex;
        return {
          ...ex,
          sets: [
            ...ex.sets,
            { setNumber: ex.sets.length + 1, reps: undefined, weight: undefined },
          ],
        };
      }),
    );
  }

  function removeSet(exIndex: number, setIndex: number) {
    setSelectedExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIndex) return ex;
        const newSets = ex.sets
          .filter((_, si) => si !== setIndex)
          .map((s, si) => ({ ...s, setNumber: si + 1 }));
        return { ...ex, sets: newSets };
      }),
    );
  }

  async function handleSubmit() {
    let hasError = false;
    setNameError("");
    setExercisesError("");
    setError("");

    if (!name.trim()) {
      setNameError(t("nameRequired"));
      hasError = true;
    }

    if (selectedExercises.length === 0) {
      setExercisesError(t("exercisesRequired"));
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);

    const res = await fetch(`/api/workouts/${workout.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, exercises: selectedExercises }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        setError(t("sessionExpired"));
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(t("genericError"));
      }
      setSubmitting(false);
      return;
    }

    router.push(`/workouts/${workout.id}`);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => router.push(`/workouts/${workout.id}`)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {t("title")}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label={t("nameLabel")}
        placeholder={t("namePlaceholder")}
        fullWidth
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError("");
        }}
        error={!!nameError}
        helperText={nameError}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {t("exercises")}
        </Typography>
        <Chip
          label={tc("selected", { count: selectedExercises.length })}
          size="small"
          color={selectedExercises.length > 0 ? "primary" : "default"}
        />
      </Box>

      {exercisesError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {exercisesError}
        </Alert>
      )}

      <Stack spacing={2} sx={{ mb: 2 }}>
        {selectedExercises.map((selEx, exIndex) => {
          const exercise = exercises.find((e) => e.id === selEx.exerciseId);
          if (!exercise) return null;

          return (
            <Card key={exIndex} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {exercise.name}
                    </Typography>
                    <Chip label={exercise.bodyPart} size="small" sx={{ mt: 0.5 }} />
                  </Box>
                  <IconButton color="error" onClick={() => removeExercise(exIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {selEx.sets.map((set, setIndex) => (
                  <Box
                    key={setIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 40 }}>
                      {tc("set", { number: set.setNumber })}
                    </Typography>
                    <TextField
                      label={tc("reps")}
                      type="number"
                      size="small"
                      value={set.reps ?? ""}
                      onChange={(e) => updateSet(exIndex, setIndex, "reps", e.target.value)}
                      sx={{ width: 80 }}
                    />
                    <TextField
                      label={tc("weight")}
                      type="number"
                      size="small"
                      value={set.weight ?? ""}
                      onChange={(e) => updateSet(exIndex, setIndex, "weight", e.target.value)}
                      sx={{ width: 100 }}
                    />
                    {selEx.sets.length > 1 && (
                      <IconButton size="small" onClick={() => removeSet(exIndex, setIndex)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button size="small" startIcon={<AddIcon />} onClick={() => addSet(exIndex)}>
                  {t("addSet")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<AddIcon />}
        onClick={() => setShowPicker(true)}
        sx={{ mb: 3 }}
      >
        {t("addExercise")}
      </Button>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? t("saving") : t("save")}
      </Button>

      <Dialog open={showPicker} onClose={() => setShowPicker(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t("pickExercise")}</DialogTitle>
        <DialogContent sx={{ px: 0, pb: 0 }}>
          <Tabs
            value={pickerTab}
            onChange={(_, v) => setPickerTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, mb: 1 }}
          >
            {pickerTabs.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
          <List disablePadding>
            {pickerExercises.map((ex) => (
              <ListItemButton key={ex.id} onClick={() => addExercise(ex.id)}>
                <ListItemText
                  primary={ex.name}
                  secondary={`${ex.bodyPart} · ${tc("level", { level: ex.level })} · ${ex.defaultSets} x ${ex.defaultReps}`}
                />
                {favouriteSet.has(ex.id) && (
                  <FavoriteIcon fontSize="small" color="error" sx={{ ml: 0.5 }} />
                )}
                {ex.videoUrl && (
                  <PlayCircleOutlineIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
                )}
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
