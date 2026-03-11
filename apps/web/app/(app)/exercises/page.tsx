import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExerciseLibrary from "./ExerciseLibrary";

export default async function ExercisesPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const exercises = await prisma.exercise.findMany({
    orderBy: [{ bodyPart: "asc" }, { level: "asc" }, { name: "asc" }],
  });

  const favourites = await prisma.favouriteExercise.findMany({
    where: { userId: session.userId },
    select: { exerciseId: true },
  });

  const bodyParts = [...new Set(exercises.map((e) => e.bodyPart))];
  const favouriteIds = favourites.map((f) => f.exerciseId);

  return <ExerciseLibrary exercises={exercises} bodyParts={bodyParts} favouriteIds={favouriteIds} />;
}
