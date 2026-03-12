import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { addExerciseInputSchema, updateWorkoutInputSchema } from "@/lib/schemas";
import { checkAndAwardBadges } from "@/lib/badge-checker";

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
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const workout = await prisma.workout.findUnique({ where: { id } });
  if (!workout || workout.userId !== session.userId) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  // Delete all sessions of this template too
  if (workout.templateId === null) {
    await prisma.workout.deleteMany({ where: { templateId: id } });
  }

  await prisma.workout.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const workout = await prisma.workout.findUnique({ where: { id } });
  if (!workout || workout.userId !== session.userId) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  // If feedback fields are provided, update them on an already-completed workout
  if (body.difficulty !== undefined || body.mood !== undefined) {
    const updated = await prisma.workout.update({
      where: { id },
      data: {
        ...(body.difficulty !== undefined && { difficulty: body.difficulty as number }),
        ...(body.mood !== undefined && { mood: body.mood as number }),
      },
    });
    return NextResponse.json(updated);
  }

  // Otherwise, mark workout as completed
  const updated = await prisma.workout.update({
    where: { id },
    data: { completed: true, completedAt: new Date() },
  });

  const newBadges = await checkAndAwardBadges(session.userId);

  return NextResponse.json({ ...updated, newBadges });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const workout = await prisma.workout.findUnique({ where: { id } });
  if (!workout || workout.userId !== session.userId) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  // Only templates (not sessions) can be edited
  if (workout.templateId !== null) {
    return NextResponse.json({ error: "Cannot edit a session" }, { status: 400 });
  }

  const body = await request.json();
  const result = updateWorkoutInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { name, exercises } = result.data;

  // Delete existing workout exercises and their sets, then recreate
  await prisma.workoutExercise.deleteMany({ where: { workoutId: id } });

  const updated = await prisma.workout.update({
    where: { id },
    data: {
      name,
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

  return NextResponse.json(updated);
}
