import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkoutHistory from "./WorkoutHistory";

export default async function HistoryPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const workouts = await prisma.workout.findMany({
    where: {
      userId: session.userId,
      templateId: { not: null },
      completed: true,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: "asc" } },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { date: "desc" },
  });

  return <WorkoutHistory workouts={workouts} />;
}
