import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateSetInputSchema } from "@/lib/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const result = updateSetInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const set = await prisma.exerciseSet.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(set);
}
