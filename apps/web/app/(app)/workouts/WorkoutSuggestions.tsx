"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  level: number;
  defaultSets: number;
  defaultReps: string;
}

interface CompletedSession {
  id: string;
  completedAt: string | Date | null;
  exercises: { exercise: { bodyPart: string } }[];
}

interface WorkoutSuggestionsProps {
  exercises: Exercise[];
  completedSessions: CompletedSession[];
}

interface Suggestion {
  key: string;
  titleKey: string;
  bodyParts: string[];
  exerciseIds: string[];
}

function buildSuggestions(
  exercises: Exercise[],
  completedSessions: CompletedSession[],
): Suggestion[] {
  const byBodyPart = new Map<string, Exercise[]>();
  for (const ex of exercises) {
    const list = byBodyPart.get(ex.bodyPart) ?? [];
    list.push(ex);
    byBodyPart.set(ex.bodyPart, list);
  }

  // Count how many times each body part was trained
  const bodyPartCount = new Map<string, number>();
  for (const s of completedSessions) {
    const parts = new Set(s.exercises.map((e) => e.exercise.bodyPart));
    for (const bp of parts) {
      bodyPartCount.set(bp, (bodyPartCount.get(bp) ?? 0) + 1);
    }
  }

  // Find body parts not trained recently (not in last 5 sessions)
  const recentParts = new Set<string>();
  for (const s of completedSessions.slice(0, 5)) {
    for (const e of s.exercises) {
      recentParts.add(e.exercise.bodyPart);
    }
  }

  const suggestions: Suggestion[] = [];

  // 1. Suggest neglected body parts first
  const allParts = [...byBodyPart.keys()];
  const neglectedParts = allParts.filter((bp) => !recentParts.has(bp));
  for (const bp of neglectedParts) {
    const exs = byBodyPart.get(bp) ?? [];
    const picks = exs.filter((e) => e.level <= 2);
    if (picks.length > 0) {
      suggestions.push({
        key: `neglected_${bp}`,
        titleKey: `neglected_${bp}`,
        bodyParts: [bp],
        exerciseIds: picks.map((e) => e.id),
      });
    }
  }

  // 2. Suggest most trained body parts (top 3) at next level
  const sortedByCount = [...bodyPartCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [bp, count] of sortedByCount) {
    const exs = byBodyPart.get(bp) ?? [];
    // If trained a lot, suggest advanced exercises
    const targetLevel = count >= 3 ? 2 : 1;
    const picks = exs.filter((e) => e.level >= targetLevel);
    if (picks.length > 0) {
      const titleKey = targetLevel >= 2 ? `levelUp_${bp}` : `repeat_${bp}`;
      suggestions.push({
        key: titleKey,
        titleKey,
        bodyParts: [bp],
        exerciseIds: picks.map((e) => e.id),
      });
    }
  }

  // 3. Always offer full body, upper, lower as fallbacks
  const fullBodyIds: string[] = [];
  const fullBodyParts: string[] = [];
  for (const [bp, exs] of byBodyPart) {
    const pick = exs.find((e) => e.level === 1) ?? exs[0];
    if (pick) {
      fullBodyIds.push(pick.id);
      fullBodyParts.push(bp);
    }
  }
  if (fullBodyIds.length >= 3) {
    suggestions.push({
      key: "fullBody",
      titleKey: "fullBody",
      bodyParts: fullBodyParts,
      exerciseIds: fullBodyIds,
    });
  }

  const upperParts = ["Skulder", "Rygg"];
  const upperIds: string[] = [];
  for (const bp of upperParts) {
    for (const ex of (byBodyPart.get(bp) ?? []).filter((e) => e.level <= 2)) {
      upperIds.push(ex.id);
    }
  }
  if (upperIds.length > 0) {
    suggestions.push({
      key: "upperBody",
      titleKey: "upperBody",
      bodyParts: upperParts.filter((bp) => byBodyPart.has(bp)),
      exerciseIds: upperIds,
    });
  }

  const lowerParts = ["Kne", "Ankel", "Hofte", "Lår"];
  const lowerIds: string[] = [];
  for (const bp of lowerParts) {
    for (const ex of (byBodyPart.get(bp) ?? []).filter((e) => e.level <= 2)) {
      lowerIds.push(ex.id);
    }
  }
  if (lowerIds.length > 0) {
    suggestions.push({
      key: "lowerBody",
      titleKey: "lowerBody",
      bodyParts: lowerParts.filter((bp) => byBodyPart.has(bp)),
      exerciseIds: lowerIds,
    });
  }

  // Deduplicate by key
  const seen = new Set<string>();
  return suggestions.filter((s) => {
    if (seen.has(s.key)) return false;
    seen.add(s.key);
    return true;
  });
}

export default function WorkoutSuggestions({
  exercises,
  completedSessions,
}: WorkoutSuggestionsProps) {
  const router = useRouter();
  const t = useTranslations("suggestions");
  const [creating, setCreating] = useState<string | null>(null);

  const suggestions = buildSuggestions(exercises, completedSessions);

  async function handleSelect(suggestion: Suggestion) {
    setCreating(suggestion.key);

    const workoutExercises = suggestion.exerciseIds.map((exerciseId) => {
      const ex = exercises.find((e) => e.id === exerciseId)!;
      const repsNum = parseInt(ex.defaultReps, 10);
      const defaultReps = Number.isNaN(repsNum) ? undefined : repsNum;
      return {
        exerciseId,
        sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
          setNumber: i + 1,
          reps: defaultReps,
          weight: undefined as number | undefined,
          duration: undefined as number | undefined,
        })),
      };
    });

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: t(suggestion.titleKey),
        exercises: workoutExercises,
      }),
    });

    if (res.ok) {
      const workout = await res.json();
      router.push(`/workouts/${workout.id}`);
    }

    setCreating(null);
  }

  if (suggestions.length === 0) return null;

  return (
    <Container maxWidth="sm" sx={{ pb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
        {t("title")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {suggestions.map((s) => (
          <Card
            key={s.key}
            variant="outlined"
            sx={{ minWidth: 200, maxWidth: 220, flexShrink: 0 }}
          >
            <CardActionArea onClick={() => handleSelect(s)} disabled={creating !== null}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                {creating === s.key ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                      {t(s.titleKey)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                      {s.bodyParts.map((bp) => (
                        <Chip key={bp} label={bp} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {s.exerciseIds.length} {t("exerciseCount")}
                    </Typography>
                  </>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
