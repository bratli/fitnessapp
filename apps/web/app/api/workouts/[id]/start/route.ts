import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const template = await prisma.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        include: { sets: { orderBy: { setNumber: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!template || template.userId !== session.userId) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  if (template.templateId !== null) {
    return NextResponse.json({ error: "Cannot start a session" }, { status: 400 });
  }

  const workout = await prisma.workout.create({
    data: {
      name: template.name,
      userId: session.userId,
      templateId: template.id,
      exercises: {
        create: template.exercises.map((ex) => ({
          order: ex.order,
          exerciseId: ex.exerciseId,
          sets: {
            create: ex.sets.map((s) => ({
              setNumber: s.setNumber,
              reps: s.reps,
              weight: s.weight,
              duration: s.duration,
              completed: false,
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
