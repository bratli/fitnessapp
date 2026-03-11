import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { createWorkoutInputSchema } from "@/lib/schemas";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workouts = await prisma.workout.findMany({
    where: { userId: session.userId },
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

  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = createWorkoutInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { name, exercises } = result.data;

  const workout = await prisma.workout.create({
    data: {
      name,
      userId: session.userId,
      exercises: {
        create: exercises.map((ex, index) => ({
          order: index + 1,
          exerciseId: ex.exerciseId,
          sets: {
            create: ex.sets.map((s) => ({
              setNumber: s.setNumber,
              reps: s.reps,
              weight: s.weight,
              duration: s.duration,
            })),
          },
        })),
      },
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
  });

  return NextResponse.json(workout, { status: 201 });
}
