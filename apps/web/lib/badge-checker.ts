import { prisma } from "@/lib/db";
import { BADGE_DEFINITIONS } from "@/lib/badges";

interface AwardedBadge {
  badgeId: string;
}

/**
 * Evaluate all badge definitions against the user's current stats.
 * Awards any newly qualified badges and returns the list of newly earned ones.
 */
export async function checkAndAwardBadges(userId: string): Promise<AwardedBadge[]> {
  // Gather all stats in parallel
  const [totalWorkouts, completedDates, existing] =
    await Promise.all([
      // Total completed workouts
      prisma.workout.count({
        where: { userId, completed: true, templateId: { not: null } },
      }),

      // All completed dates for streak calculation
      prisma.workout.findMany({
        where: { userId, completed: true, templateId: { not: null } },
        select: { completedAt: true },
        orderBy: { completedAt: "desc" },
      }),

      // Already earned badges
      prisma.userBadge.findMany({ where: { userId } }),
    ]);

  const streak = calculateStreak(completedDates.map((w) => w.completedAt).filter(Boolean) as Date[]);

  const earnedSet = new Set(existing.map((b) => b.badgeId));

  const stats: Record<string, number> = {
    total_workouts: totalWorkouts,
    streak,
  };

  const newBadges: AwardedBadge[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    const value = stats[badge.statKey] ?? 0;
    if (value >= badge.threshold && !earnedSet.has(badge.id)) {
      newBadges.push({ badgeId: badge.id });
      earnedSet.add(badge.id);
    }
  }

  // Persist all new badges
  if (newBadges.length > 0) {
    await prisma.userBadge.createMany({
      data: newBadges.map((b) => ({
        userId,
        badgeId: b.badgeId,
      })),
    });
  }

  return newBadges;
}

function calculateStreak(sortedDates: Date[]): number {
  if (sortedDates.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const d of sortedDates) {
    uniqueDays.add(d.toISOString().slice(0, 10));
  }

  const days = [...uniqueDays].sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  // Streak must include today or yesterday to be active
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
      // consecutive day (with small tolerance)
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
