import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favourites = await prisma.favouriteExercise.findMany({
    where: { userId: session.userId },
    select: { exerciseId: true },
  });

  return NextResponse.json(favourites.map((f) => f.exerciseId));
}

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const exerciseId = typeof body.exerciseId === "string" ? body.exerciseId : null;

  if (!exerciseId) {
    return NextResponse.json({ error: "exerciseId is required" }, { status: 400 });
  }

  const existing = await prisma.favouriteExercise.findUnique({
    where: { userId_exerciseId: { userId: session.userId, exerciseId } },
  });

  if (existing) {
    await prisma.favouriteExercise.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ favourited: false });
  }

  await prisma.favouriteExercise.create({
    data: { userId: session.userId, exerciseId },
  });

  return NextResponse.json({ favourited: true });
}
