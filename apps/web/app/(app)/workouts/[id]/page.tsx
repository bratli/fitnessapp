import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ActiveWorkout from "./ActiveWorkout";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workout = await prisma.workout.findUnique({
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
  });

  if (!workout) notFound();

  return <ActiveWorkout workout={workout} />;
}
