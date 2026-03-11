import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ActiveWorkout from "./ActiveWorkout";
import WorkoutOverview from "./WorkoutOverview";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [workout, allExercises] = await Promise.all([
    prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: { orderBy: { setNumber: "asc" } },
          },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.exercise.findMany({
      orderBy: [{ bodyPart: "asc" }, { level: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!workout || workout.userId !== session.userId) notFound();

  // If this is a template, show the overview with Start button
  if (workout.templateId === null) {
    const activeSession = await prisma.workout.findFirst({
      where: { templateId: id, userId: session.userId, completed: false },
      orderBy: { date: "desc" },
      select: { id: true, date: true },
    });

    return <WorkoutOverview workout={workout} activeSession={activeSession} />;
  }

  // If this is a session, show the active workout
  return <ActiveWorkout workout={workout} allExercises={allExercises} />;
}
