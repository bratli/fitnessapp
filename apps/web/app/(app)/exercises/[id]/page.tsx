import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ExerciseDetail from "./ExerciseDetail";

interface ExercisePageProps {
  params: Promise<{ id: string }>;
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) notFound();

  const favourite = await prisma.favouriteExercise.findUnique({
    where: { userId_exerciseId: { userId: session.userId, exerciseId: id } },
  });

  return <ExerciseDetail exercise={exercise} isFavourite={!!favourite} />;
}
