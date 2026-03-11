import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkoutList from "./WorkoutList";

export default async function WorkoutsPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const workouts = await prisma.workout.findMany({
    where: { userId: session.userId },
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
  });

  return <WorkoutList workouts={workouts} />;
}
