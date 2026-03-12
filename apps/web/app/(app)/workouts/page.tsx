import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkoutList from "./WorkoutList";
import WorkoutSuggestions from "./WorkoutSuggestions";

export default async function WorkoutsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const [workouts, exercises, completedSessions, user, activeSession] = await Promise.all([
    prisma.workout.findMany({
      where: { userId: session.userId, templateId: null },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { date: "desc" },
    }),
    prisma.exercise.findMany({
      orderBy: [{ bodyPart: "asc" }, { level: "asc" }, { name: "asc" }],
    }),
    prisma.workout.findMany({
      where: {
        userId: session.userId,
        templateId: { not: null },
        completed: true,
      },
      select: {
        id: true,
        completedAt: true,
        exercises: {
          select: {
            exercise: { select: { bodyPart: true } },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, username: true },
    }),
    prisma.workout.findFirst({
      where: {
        userId: session.userId,
        templateId: { not: null },
        completed: false,
      },
      select: { id: true, name: true },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <>
      <WorkoutList
        workouts={workouts}
        userName={user?.name ?? user?.username ?? ""}
        activeSession={activeSession}
      />
      <WorkoutSuggestions exercises={exercises} completedSessions={completedSessions} />
    </>
  );
}
