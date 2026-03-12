import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateWorkoutForm from "./CreateWorkoutForm";

export default async function NewWorkoutPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const [exercises, favourites] = await Promise.all([
    prisma.exercise.findMany({
      orderBy: [{ bodyPart: "asc" }, { level: "asc" }, { name: "asc" }],
    }),
    prisma.favouriteExercise.findMany({
      where: { userId: session.userId },
      select: { exerciseId: true },
    }),
  ]);

  return (
    <CreateWorkoutForm
      exercises={exercises}
      favouriteIds={favourites.map((f) => f.exerciseId)}
    />
  );
}
