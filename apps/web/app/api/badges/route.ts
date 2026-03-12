import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { BADGE_DEFINITIONS } from "@/lib/badges";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [earned, totalWorkouts, streakData] = await Promise.all([
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
  ]);

  return NextResponse.json({
    definitions: BADGE_DEFINITIONS,
    earned,
    stats: {
      totalWorkouts,
      currentStreak: calculateStreak(
        streakData.map((w) => w.completedAt).filter(Boolean) as Date[],
      ),
    },
  });
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
