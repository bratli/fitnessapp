"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface ExerciseSet {
  setNumber: number;
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

interface WorkoutHistoryItem {
  id: string;
  name: string;
  date: string | Date;
  exercises: {
    exercise: { name: string; bodyPart: string };
    sets: ExerciseSet[];
  }[];
}

interface WorkoutHistoryProps {
  workouts: WorkoutHistoryItem[];
}

export default function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Historikk
      </Typography>

      {workouts.length === 0 && (
        <Typography color="text.secondary">Ingen treningshistorikk ennå.</Typography>
      )}

      <Stack spacing={2}>
        {workouts.map((workout) => (
          <Card key={workout.id} variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {workout.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(workout.date).toLocaleDateString("nb-NO")}
                </Typography>
              </Box>

              {workout.exercises.map((wEx, i) => (
                <Box key={i} sx={{ mb: i < workout.exercises.length - 1 ? 2 : 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {wEx.exercise.name}
                    </Typography>
                    <Chip label={wEx.exercise.bodyPart} size="small" variant="outlined" />
                  </Box>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sett</TableCell>
                        <TableCell align="right">Reps</TableCell>
                        <TableCell align="right">Vekt (kg)</TableCell>
                        <TableCell align="center">Utført</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {wEx.sets.map((set) => (
                        <TableRow key={set.setNumber}>
                          <TableCell>{set.setNumber}</TableCell>
                          <TableCell align="right">{set.reps ?? "–"}</TableCell>
                          <TableCell align="right">{set.weight ?? "–"}</TableCell>
                          <TableCell align="center">
                            {set.completed ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
