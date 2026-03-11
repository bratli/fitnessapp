"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  videoUrl: string | null;
  bodyPart: string;
  level: number;
  defaultSets: number;
  defaultReps: string;
}

interface ExerciseLibraryProps {
  exercises: Exercise[];
  bodyParts: string[];
  favouriteIds: string[];
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Nivå 1",
  2: "Nivå 2",
  3: "Nivå 3",
};

const LEVEL_COLORS: Record<number, "success" | "warning" | "error"> = {
  1: "success",
  2: "warning",
  3: "error",
};

const FAVOURITES_TAB = "Favoritter";

export default function ExerciseLibrary({
  exercises,
  bodyParts,
  favouriteIds: initialFavouriteIds,
}: ExerciseLibraryProps) {
  const router = useRouter();
  const tabs = [FAVOURITES_TAB, ...bodyParts];
  const [selectedTab, setSelectedTab] = useState(0);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set(initialFavouriteIds));
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const selectedLabel = tabs[selectedTab];

  const filtered =
    selectedLabel === FAVOURITES_TAB
      ? exercises.filter((e) => favouriteIds.has(e.id))
      : exercises.filter((e) => e.bodyPart === selectedLabel);

  const groupedByLevel = filtered.reduce<Record<number, Exercise[]>>((acc, ex) => {
    const level = ex.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(ex);
    return acc;
  }, {});

  async function toggleFavourite(exerciseId: string) {
    setTogglingId(exerciseId);
    const res = await fetch("/api/exercises/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId }),
    });

    if (res.ok) {
      const data = await res.json();
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        if (data.favourited) {
          next.add(exerciseId);
        } else {
          next.delete(exerciseId);
        }
        return next;
      });
    }
    setTogglingId(null);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Øvelser
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(_, v) => setSelectedTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {tabs.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {selectedLabel === FAVOURITES_TAB && filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          Du har ingen favorittøvelser ennå. Trykk på hjertet ved en øvelse for å legge den til.
        </Typography>
      )}

      {Object.entries(groupedByLevel)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, exs]) => (
          <Box key={level} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              {LEVEL_LABELS[Number(level)] ?? `Nivå ${level}`}
            </Typography>

            <Stack spacing={1}>
              {exs.map((ex) => (
                  <Card key={ex.id} variant="outlined">
                    <CardActionArea onClick={() => router.push(`/exercises/${ex.id}`)}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {ex.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ex.defaultSets} x {ex.defaultReps}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavourite(ex.id);
                              }}
                              disabled={togglingId === ex.id}
                              sx={{ color: favouriteIds.has(ex.id) ? "error.main" : "text.secondary" }}
                            >
                              {favouriteIds.has(ex.id) ? (
                                <FavoriteIcon fontSize="small" />
                              ) : (
                                <FavoriteBorderIcon fontSize="small" />
                              )}
                            </IconButton>
                            <Chip
                              label={LEVEL_LABELS[ex.level]}
                              color={LEVEL_COLORS[ex.level]}
                              size="small"
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
              ))}
            </Stack>
          </Box>
        ))}
    </Container>
  );
}
