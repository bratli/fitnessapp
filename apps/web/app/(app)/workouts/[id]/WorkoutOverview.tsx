"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const LEVEL_COLORS: Record<number, "success" | "warning" | "error"> = {
  1: "success",
  2: "warning",
  3: "error",
};

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
  sets: { setNumber: number; reps: number | null; weight: number | null }[];
}

interface ActiveSession {
  id: string;
  date: string | Date;
}

interface WorkoutOverviewProps {
  workout: {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
  };
  activeSession: ActiveSession | null;
}

export default function WorkoutOverview({ workout, activeSession }: WorkoutOverviewProps) {
  const router = useRouter();
  const t = useTranslations("workoutOverview");
  const tc = useTranslations("common");
  const te = useTranslations("exerciseDetail");
  const [starting, setStarting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  async function handleStart() {
    setStarting(true);
    const res = await fetch(`/api/workouts/${workout.id}/start`, { method: "POST" });
    if (res.ok) {
      const session = await res.json();
      router.push(`/workouts/${session.id}`);
    }
    setStarting(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/workouts/${workout.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/workouts");
    }
    setDeleting(false);
    setShowDeleteDialog(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => router.push("/workouts")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
          {workout.name}
        </Typography>
        <IconButton onClick={() => router.push(`/workouts/${workout.id}/edit`)}>
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => setShowDeleteDialog(true)}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Box>

      {activeSession && (
        <Card
          variant="outlined"
          sx={{ mb: 2, borderColor: "primary.main", cursor: "pointer" }}
          onClick={() => router.push(`/workouts/${activeSession.id}`)}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 1, py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <PlayArrowIcon color="primary" />
            <Typography variant="body2" fontWeight="medium" sx={{ flex: 1 }}>
              {t("activeSession")}
            </Typography>
            <Button size="small" variant="text">
              {t("resume")}
            </Button>
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<PlayArrowIcon />}
        onClick={handleStart}
        disabled={starting}
        sx={{ mb: 3 }}
      >
        {starting ? t("starting") : t("start")}
      </Button>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {workout.exercises.length} {tc("exercises")}
      </Typography>

      <Stack spacing={1.5}>
        {workout.exercises.map((wEx) => {
          const isExpanded = expandedExercise === wEx.id;
          return (
            <Card key={wEx.id} variant="outlined">
              <CardActionArea
                onClick={() => setExpandedExercise(isExpanded ? null : wEx.id)}
              >
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {wEx.exercise.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {wEx.sets.length} {tc("sets")} · {tc("level", { level: wEx.exercise.level })}
                      </Typography>
                    </Box>
                    <Chip
                      label={wEx.exercise.bodyPart}
                      size="small"
                    />
                    <Chip
                      label={tc("level", { level: wEx.exercise.level })}
                      color={LEVEL_COLORS[wEx.exercise.level]}
                      size="small"
                    />
                    <ExpandMoreIcon
                      sx={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        color: "text.secondary",
                      }}
                    />
                  </Box>
                </CardContent>
              </CardActionArea>

              <Collapse in={isExpanded}>
                <CardContent sx={{ pt: 0 }}>
                  {wEx.exercise.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {wEx.exercise.description}
                    </Typography>
                  )}

                  {wEx.exercise.videoUrl && (
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <PlayCircleOutlineIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {te("video")}
                        </Typography>
                      </Box>
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
                          src={wEx.exercise.videoUrl}
                          title={`Video: ${wEx.exercise.name}`}
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
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        {te("source")}
                      </Typography>
                    </Box>
                  )}

                  {!wEx.exercise.videoUrl && !wEx.exercise.description && (
                    <Typography variant="body2" color="text.secondary">
                      {te("noContent")}
                    </Typography>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Stack>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("deleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("deleteMessage")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {t("deleteCancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? t("deleting") : t("deleteConfirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
