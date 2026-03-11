import { prisma } from "@/lib/db";
import CreateWorkoutForm from "./CreateWorkoutForm";

export default async function NewWorkoutPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: [{ bodyPart: "asc" }, { level: "asc" }, { name: "asc" }],
  });

  return <CreateWorkoutForm exercises={exercises} />;
}
