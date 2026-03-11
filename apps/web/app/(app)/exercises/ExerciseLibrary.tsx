"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

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

const LEVEL_COLORS: Record<number, "success" | "warning" | "error"> = {
  1: "success",
  2: "warning",
  3: "error",
};

export default function ExerciseLibrary({
  exercises,
  bodyParts,
  favouriteIds: initialFavouriteIds,
}: ExerciseLibraryProps) {
  const router = useRouter();
  const t = useTranslations("exerciseLibrary");
  const tc = useTranslations("common");
  const tabs = [t("favourites"), ...bodyParts];
  const [selectedTab, setSelectedTab] = useState(0);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set(initialFavouriteIds));
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const selectedLabel = tabs[selectedTab];
  const favouritesLabel = tabs[0];

  const filtered =
    selectedLabel === favouritesLabel
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
        {t("title")}
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

      {selectedLabel === favouritesLabel && filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          {t("noFavourites")}
        </Typography>
      )}

      {Object.entries(groupedByLevel)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, exs]) => (
          <Box key={level} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              {tc("level", { level: Number(level) })}
            </Typography>

            <Stack spacing={1}>
              {exs.map((ex) => (
                  <Card key={ex.id} variant="outlined" sx={{ display: "flex" }}>
                    <CardActionArea onClick={() => router.push(`/exercises/${ex.id}`)} sx={{ flex: 1 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Typography variant="body1" fontWeight="medium">
                                {ex.name}
                              </Typography>
                              {ex.videoUrl && (
                                <PlayCircleOutlineIcon
                                  fontSize="small"
                                  sx={{ color: "primary.main", fontSize: 18 }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {ex.defaultSets} x {ex.defaultReps}
                            </Typography>
                          </Box>
                          <Chip
                            label={tc("level", { level: ex.level })}
                            color={LEVEL_COLORS[ex.level]}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                    <IconButton
                      size="small"
                      onClick={() => toggleFavourite(ex.id)}
                      disabled={togglingId === ex.id}
                      sx={{ color: favouriteIds.has(ex.id) ? "error.main" : "text.secondary", px: 1.5 }}
                    >
                      {favouriteIds.has(ex.id) ? (
                        <FavoriteIcon fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Card>
              ))}
            </Stack>
          </Box>
        ))}
    </Container>
  );
}
