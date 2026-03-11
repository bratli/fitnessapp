"use client";

import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";

interface WorkoutSummary {
  id: string;
  name: string;
  date: string | Date;
  completed: boolean;
  exercises: {
    exercise: { name: string; bodyPart: string };
    sets: { completed: boolean }[];
  }[];
}

interface WorkoutListProps {
  workouts: WorkoutSummary[];
}

export default function WorkoutList({ workouts }: WorkoutListProps) {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Treningsøkter
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => router.push("/workouts/new")}
        >
          Ny
        </Button>
      </Box>

      {workouts.length === 0 && (
        <Typography color="text.secondary">
          Ingen treningsøkter ennå. Opprett din første!
        </Typography>
      )}

      <Stack spacing={2}>
        {workouts.map((workout) => {
          const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
          const completedSets = workout.exercises.reduce(
            (s, e) => s + e.sets.filter((set) => set.completed).length,
            0,
          );
          const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
          const bodyParts = [...new Set(workout.exercises.map((e) => e.exercise.bodyPart))];

          return (
            <Card key={workout.id} variant="outlined">
              <CardActionArea onClick={() => router.push(`/workouts/${workout.id}`)}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {workout.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(workout.date).toLocaleDateString("nb-NO")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1, mb: 1 }}>
                    {bodyParts.map((bp) => (
                      <Chip key={bp} label={bp} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {workout.exercises.length} øvelser · {completedSets}/{totalSets} sett
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
