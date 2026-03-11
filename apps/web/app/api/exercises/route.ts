import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const bodyPart = searchParams.get("bodyPart");
  const level = searchParams.get("level");

  const where: Record<string, unknown> = {};
  if (bodyPart) where.bodyPart = bodyPart;
  if (level) where.level = Number(level);

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: [{ bodyPart: "asc" }, { level: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(exercises);
}
