import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditWorkoutForm from "./EditWorkoutForm";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [workout, allExercises, favourites] = await Promise.all([
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
    prisma.favouriteExercise.findMany({
      where: { userId: session.userId },
      select: { exerciseId: true },
    }),
  ]);

  if (!workout || workout.userId !== session.userId) notFound();

  // Only templates can be edited
  if (workout.templateId !== null) notFound();

  return (
    <EditWorkoutForm
      workout={workout}
      exercises={allExercises}
      favouriteIds={favourites.map((f) => f.exerciseId)}
    />
  );
}
