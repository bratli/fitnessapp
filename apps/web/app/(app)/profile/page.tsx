import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BADGE_DEFINITIONS } from "@/lib/badges";
import ProfileView from "./ProfileView";
import type { WeeklySummary } from "./ProfileView";

export default async function ProfilePage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);

  const [user, earned, totalWorkouts, streakData, thisWeekWorkouts, prevWeekWorkouts] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { username: true, name: true, createdAt: true },
      }),
      prisma.userBadge.findMany({
        where: { userId: session.userId },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.workout.count({
        where: { userId: session.userId, completed: true, templateId: { not: null } },
      }),
      prisma.workout.findMany({
        where: { userId: session.userId, completed: true, templateId: { not: null } },
        select: { completedAt: true },
        orderBy: { completedAt: "desc" },
      }),
      prisma.workout.findMany({
        where: {
          userId: session.userId,
          completed: true,
          templateId: { not: null },
          completedAt: { gte: weekAgo },
        },
        include: {
          exercises: {
            include: {
              exercise: { select: { bodyPart: true } },
              sets: { select: { completed: true } },
            },
          },
        },
      }),
      prisma.workout.count({
        where: {
          userId: session.userId,
          completed: true,
          templateId: { not: null },
          completedAt: { gte: twoWeeksAgo, lt: weekAgo },
        },
      }),
    ]);

  const streak = calculateStreak(
    streakData.map((w) => w.completedAt).filter(Boolean) as Date[],
  );

  const weeklySummary = buildWeeklySummary(thisWeekWorkouts, prevWeekWorkouts);

  return (
    <ProfileView
      username={user?.username ?? ""}
      name={user?.name ?? null}
      memberSince={user?.createdAt.toISOString() ?? ""}
      definitions={BADGE_DEFINITIONS}
      earned={earned.map((b) => ({
        badgeId: b.badgeId,
        earnedAt: b.earnedAt.toISOString(),
      }))}
      stats={{ totalWorkouts, currentStreak: streak }}
      weeklySummary={weeklySummary}
    />
  );
}

interface WeekWorkout {
  difficulty: number | null;
  mood: number | null;
  exercises: {
    exercise: { bodyPart: string };
    sets: { completed: boolean }[];
  }[];
}

function buildWeeklySummary(
  workouts: WeekWorkout[],
  prevWeekCount: number,
): WeeklySummary {
  const workoutCount = workouts.length;

  const bodyPartCounts = new Map<string, number>();
  for (const w of workouts) {
    for (const e of w.exercises) {
      bodyPartCounts.set(e.exercise.bodyPart, (bodyPartCounts.get(e.exercise.bodyPart) ?? 0) + 1);
    }
  }
  const bodyParts = [...bodyPartCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([bp]) => bp);

  const difficulties = workouts.map((w) => w.difficulty).filter((d): d is number => d !== null);
  const moods = workouts.map((w) => w.mood).filter((m): m is number => m !== null);
  const avgDifficulty =
    difficulties.length > 0
      ? Math.round((difficulties.reduce((a, b) => a + b, 0) / difficulties.length) * 10) / 10
      : null;
  const avgMood =
    moods.length > 0
      ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10
      : null;

  return {
    workoutCount,
    bodyParts,
    avgDifficulty,
    avgMood,
    prevWeekCount,
  };
}

function calculateStreak(sortedDates: Date[]): number {
  if (sortedDates.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const d of sortedDates) {
    uniqueDays.add(d.toISOString().slice(0, 10));
  }

  const days = [...uniqueDays].sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  if (days[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (days[0] !== yesterday) return 0;
  }

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffMs = prev.getTime() - curr.getTime();
    if (diffMs <= 86400000 + 1000) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
