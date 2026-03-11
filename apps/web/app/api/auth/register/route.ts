import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { registerInputSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = registerInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { username, email, password, name } = result.data;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existingUser) {
    const field = existingUser.username === username ? "Brukernavn" : "E-post";
    return NextResponse.json({ error: `${field} er allerede i bruk` }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, passwordHash, name },
  });

  await createSession({ userId: user.id, username: user.username });

  return NextResponse.json(
    { id: user.id, username: user.username, name: user.name },
    { status: 201 },
  );
}
