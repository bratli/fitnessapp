"use client";

import { useTranslations, useLocale } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import type { BadgeDefinition } from "@/lib/badges";

export interface WeeklySummary {
  workoutCount: number;
  bodyParts: string[];
  avgDifficulty: number | null;
  avgMood: number | null;
  prevWeekCount: number;
}

interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

interface ProfileViewProps {
  username: string;
  name: string | null;
  memberSince: string;
  definitions: BadgeDefinition[];
  earned: EarnedBadge[];
  stats: {
    totalWorkouts: number;
    currentStreak: number;
  };
  weeklySummary: WeeklySummary;
}

const CATEGORY_ORDER = ["consistency"] as const;

export default function ProfileView({
  username,
  name,
  memberSince,
  definitions,
  earned,
  stats,
  weeklySummary,
}: ProfileViewProps) {
  const t = useTranslations("badges");
  const tw = useTranslations("weeklySummary");
  const tn = useTranslations("nav");
  const locale = useLocale();

  const earnedSet = new Set<string>();
  for (const b of earned) {
    earnedSet.add(b.badgeId);
  }

  // Group definitions by category
  const grouped = new Map<string, BadgeDefinition[]>();
  for (const d of definitions) {
    const list = grouped.get(d.category) ?? [];
    list.push(d);
    grouped.set(d.category, list);
  }

  const totalEarned = earned.length;
  const totalPossible = definitions.length;

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {tn("profile")}
      </Typography>

      {/* User info */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {name ?? username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{username} &middot; {t("memberSince")}{" "}
            {new Date(memberSince).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
            })}
          </Typography>
        </CardContent>
      </Card>

      {/* Stats row */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <StatCard
          icon={<FitnessCenterIcon />}
          value={stats.totalWorkouts}
          label={t("statWorkouts")}
        />
        <StatCard
          icon={<LocalFireDepartmentIcon />}
          value={stats.currentStreak}
          label={t("statStreak")}
        />
      </Box>

      {/* Weekly Summary */}
      <WeeklySummaryCard summary={weeklySummary} />

    </Container>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, textAlign: "center" }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ color: "primary.main", mb: 0.5 }}>{icon}</Box>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

const MOOD_ICONS = [
  SentimentVeryDissatisfiedIcon,
  SentimentDissatisfiedIcon,
  SentimentNeutralIcon,
  SentimentSatisfiedIcon,
  SentimentVerySatisfiedIcon,
];

function WeeklySummaryCard({ summary }: { summary: WeeklySummary }) {
  const tw = useTranslations("weeklySummary");

  const { workoutCount, bodyParts, avgDifficulty, avgMood, prevWeekCount } = summary;

  const diff = workoutCount - prevWeekCount;
  const TrendIcon = diff > 0 ? TrendingUpIcon : diff < 0 ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor = diff > 0 ? "success.main" : diff < 0 ? "warning.main" : "text.secondary";

  const MoodIcon = avgMood !== null ? MOOD_ICONS[Math.round(avgMood) - 1] ?? SentimentNeutralIcon : null;

  // Generate a contextual tip
  const tipKey = getTipKey(summary);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CalendarTodayIcon sx={{ color: "primary.main" }} />
          <Typography variant="subtitle1" fontWeight="bold">
            {tw("title")}
          </Typography>
        </Box>

        {workoutCount === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {tw("noWorkouts")}
          </Typography>
        ) : (
          <>
            {/* Load overview */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <FitnessCenterIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2">
                {tw("load", { workouts: workoutCount })}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
                <TrendIcon sx={{ fontSize: 18, color: trendColor }} />
                <Typography variant="caption" sx={{ color: trendColor }}>
                  {diff > 0 ? `+${diff}` : diff === 0 ? "=" : diff} {tw("vsLastWeek")}
                </Typography>
              </Box>
            </Box>

            {/* Focus areas */}
            {bodyParts.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {tw("focus")}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {bodyParts.map((bp, i) => (
                    <Chip
                      key={bp}
                      label={bp}
                      size="small"
                      variant={i === 0 ? "filled" : "outlined"}
                      color={i === 0 ? "primary" : "default"}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Difficulty & Mood */}
            {(avgDifficulty !== null || avgMood !== null) && (
              <Box sx={{ display: "flex", gap: 3, mb: 1.5 }}>
                {avgDifficulty !== null && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {tw("avgDifficulty")}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {avgDifficulty}/5
                    </Typography>
                  </Box>
                )}
                {avgMood !== null && MoodIcon && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {tw("avgMood")}
                    </Typography>
                    <MoodIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Tip */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TipsAndUpdatesIcon sx={{ color: "warning.main", fontSize: 20, mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary">
                {tw(tipKey)}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function getTipKey(summary: WeeklySummary): string {
  const { workoutCount, bodyParts, avgDifficulty, avgMood, prevWeekCount } = summary;

  // High difficulty + low mood → suggest lighter week
  if (avgDifficulty !== null && avgDifficulty >= 4 && avgMood !== null && avgMood <= 2) {
    return "tipRecovery";
  }

  // Low volume compared to last week
  if (prevWeekCount > 0 && workoutCount < prevWeekCount) {
    return "tipConsistency";
  }

  // Only training 1 body part → suggest variety
  if (bodyParts.length === 1) {
    return "tipVariety";
  }

  // High volume → suggest rest
  if (workoutCount >= 5) {
    return "tipRest";
  }

  // Low difficulty → suggest challenge
  if (avgDifficulty !== null && avgDifficulty <= 2) {
    return "tipChallenge";
  }

  // Good mood + good volume → keep it up
  if (avgMood !== null && avgMood >= 4 && workoutCount >= 3) {
    return "tipKeepItUp";
  }

  // Default
  return "tipGeneral";
}
