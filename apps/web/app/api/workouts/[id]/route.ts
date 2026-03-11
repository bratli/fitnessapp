import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { addExerciseInputSchema } from "@/lib/schemas";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  return NextResponse.json(workout);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: { exercises: true },
  });

  if (!workout || workout.userId !== session.userId) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  const body = await request.json();
  const result = addExerciseInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { exerciseId, sets } = result.data;
  const nextOrder = workout.exercises.length + 1;

  const workoutExercise = await prisma.workoutExercise.create({
    data: {
      workoutId: id,
      exerciseId,
      order: nextOrder,
      sets: {
        create: sets.map((s) => ({
          setNumber: s.setNumber,
          reps: s.reps,
          weight: s.weight,
          duration: s.duration,
        })),
      },
    },
    include: {
      exercise: true,
      sets: { orderBy: { setNumber: "asc" } },
    },
  });

  return NextResponse.json(workoutExercise, { status: 201 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.workout.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const workout = await prisma.workout.findUnique({ where: { id } });
  if (!workout || workout.userId !== session.userId) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  const updated = await prisma.workout.update({
    where: { id },
    data: { completed: true, completedAt: new Date() },
  });

  return NextResponse.json(updated);
}
