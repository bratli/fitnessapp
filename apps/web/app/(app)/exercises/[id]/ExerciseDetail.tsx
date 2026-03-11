"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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

interface ExerciseDetailProps {
  exercise: Exercise;
  isFavourite: boolean;
}

export default function ExerciseDetail({
  exercise,
  isFavourite: initialFavourite,
}: ExerciseDetailProps) {
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(initialFavourite);
  const [toggling, setToggling] = useState(false);

  async function toggleFavourite() {
    setToggling(true);
    const res = await fetch("/api/exercises/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId: exercise.id }),
    });

    if (res.ok) {
      const data = await res.json();
      setIsFavourite(data.favourited);
    }
    setToggling(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
          {exercise.name}
        </Typography>
        <IconButton
          onClick={toggleFavourite}
          disabled={toggling}
          sx={{ color: isFavourite ? "error.main" : "text.secondary" }}
        >
          {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Chip label={exercise.bodyPart} variant="outlined" />
        <Chip
          label={LEVEL_LABELS[exercise.level]}
          color={LEVEL_COLORS[exercise.level]}
          size="small"
        />
        <Chip
          label={`${exercise.defaultSets} x ${exercise.defaultReps}`}
          variant="outlined"
          size="small"
        />
      </Box>

      {exercise.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {exercise.description}
        </Typography>
      )}

      {exercise.videoUrl && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Video
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "background.paper",
            }}
          >
            <iframe
              src={exercise.videoUrl}
              title={`Video: ${exercise.name}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Kilde: skadefri.no
          </Typography>
        </Box>
      )}

      {!exercise.videoUrl && !exercise.description && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          Ingen beskrivelse eller video tilgjengelig for denne øvelsen.
        </Typography>
      )}
    </Container>
  );
}
