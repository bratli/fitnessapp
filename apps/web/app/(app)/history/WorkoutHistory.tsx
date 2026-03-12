"use client";

import { useTranslations, useLocale } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

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
  difficulty: number | null;
  mood: number | null;
  exercises: {
    exercise: { name: string; bodyPart: string };
    sets: ExerciseSet[];
  }[];
}

interface WorkoutHistoryProps {
  workouts: WorkoutHistoryItem[];
}

const MOOD_ICONS = [
  SentimentVeryDissatisfiedIcon,
  SentimentDissatisfiedIcon,
  SentimentNeutralIcon,
  SentimentSatisfiedIcon,
  SentimentVerySatisfiedIcon,
];

export default function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const t = useTranslations("history");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t("title")}
      </Typography>

      {workouts.length === 0 && (
        <Typography color="text.secondary">{t("empty")}</Typography>
      )}

      <Stack spacing={1}>
        {workouts.map((workout) => {
          const bodyParts = [
            ...new Set(workout.exercises.map((e) => e.exercise.bodyPart)),
          ];

          return (
            <Accordion
              key={workout.id}
              disableGutters
              sx={{
                "&::before": { display: "none" },
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                "&:first-of-type": { borderRadius: 1 },
                "&:last-of-type": { borderRadius: 1 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      pr: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {workout.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(workout.date).toLocaleDateString(locale)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                    {bodyParts.map((bp) => (
                      <Chip key={bp} label={bp} size="small" variant="outlined" />
                    ))}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, alignSelf: "center" }}>
                      {workout.exercises.length} {t("exerciseCount")}
                    </Typography>
                  </Box>
                  {(workout.difficulty || workout.mood) && (
                    <Box sx={{ display: "flex", gap: 2, mt: 0.5, alignItems: "center" }}>
                      {workout.difficulty && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <FitnessCenterIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {workout.difficulty}/5
                          </Typography>
                        </Box>
                      )}
                      {workout.mood && (() => {
                        const MoodIcon = MOOD_ICONS[workout.mood - 1];
                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <MoodIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          </Box>
                        );
                      })()}
                    </Box>
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0 }}>
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
                          <TableCell>{tc("setHeader")}</TableCell>
                          <TableCell align="right">{tc("reps")}</TableCell>
                          <TableCell align="right">{tc("weight")}</TableCell>
                          <TableCell align="center">{t("completed")}</TableCell>
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
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Container>
  );
}
