"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  level: number;
  defaultSets: number;
  defaultReps: string;
}

interface SelectedExercise {
  exerciseId: string;
  sets: { setNumber: number; reps: number | undefined; weight: number | undefined }[];
}

interface CreateWorkoutFormProps {
  exercises: Exercise[];
}

export default function CreateWorkoutForm({ exercises }: CreateWorkoutFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [bodyPartFilter, setBodyPartFilter] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bodyParts = [...new Set(exercises.map((e) => e.bodyPart))];

  const filteredExercises = bodyPartFilter
    ? exercises.filter((e) => e.bodyPart === bodyPartFilter)
    : exercises;

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
    if (!name.trim()) {
      setError("Gi treningsøkten et navn");
      return;
    }
    if (selectedExercises.length === 0) {
      setError("Legg til minst én øvelse");
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, exercises: selectedExercises }),
    });

    if (!res.ok) {
      setError("Kunne ikke opprette treningsøkt");
      setSubmitting(false);
      return;
    }

    const workout = await res.json();
    router.push(`/workouts/${workout.id}`);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Ny treningsøkt
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Navn på treningsøkt"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Legg til øvelser
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Kroppsdel</InputLabel>
          <Select
            value={bodyPartFilter}
            label="Kroppsdel"
            onChange={(e) => setBodyPartFilter(e.target.value)}
          >
            <MenuItem value="">Alle</MenuItem>
            {bodyParts.map((bp) => (
              <MenuItem key={bp} value={bp}>
                {bp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>Velg øvelse</InputLabel>
          <Select
            value=""
            label="Velg øvelse"
            onChange={(e) => addExercise(e.target.value)}
          >
            {filteredExercises.map((ex) => (
              <MenuItem key={ex.id} value={ex.id}>
                {ex.name} ({ex.bodyPart}, Nivå {ex.level})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack spacing={2} sx={{ mb: 3 }}>
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
                      Sett {set.setNumber}
                    </Typography>
                    <TextField
                      label="Reps"
                      type="number"
                      size="small"
                      value={set.reps ?? ""}
                      onChange={(e) => updateSet(exIndex, setIndex, "reps", e.target.value)}
                      sx={{ width: 80 }}
                    />
                    <TextField
                      label="Vekt (kg)"
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

                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => addSet(exIndex)}
                >
                  Legg til sett
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Oppretter..." : "Opprett treningsøkt"}
      </Button>
    </Container>
  );
}
